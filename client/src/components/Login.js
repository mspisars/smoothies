
import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { axiosHelper } from "../utils";
import Header from './Header';


export default function LoginForm() {
  const navigate = useNavigate();

  let initialValues = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    isRegister: false
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('username is required'),
    password: Yup.string()
      .required('password is required'),
    confirmPassword: Yup.string().when("isRegister", {
      is: (isRegister) => isRegister === true,
      then: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
    }),
    email: Yup.string().when("isRegister", {
      is: (isRegister) => isRegister === true,
      then: Yup.string().email('email is required to register.')
    }),
  });

  useEffect(() => {
    let user = localStorage.getItem("user");
    if (user) {
      navigate("/smoothies", { replace: true });
    }
  }, [navigate]);


  async function handleSubmit(form) {
    const { data } = await axiosHelper({
      url: '/auth',
      method: 'post',
      data: form
    })
    if (data.auth) {
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/smoothies", { replace: true });
    }
  }

  return (
    <div className="App">
      <Header />
      <div className="Login container col-5">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <div className="row text-center">
                <div className="form-group col col-centered">
                  <label>Username</label>
                  <Field name="username" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                  <ErrorMessage name="username" component="div" className="invalid-feedback" />
                </div>
              </div>
              <div className="row">
                <div className="form-group col col-centered">
                  <label>Password</label>
                  <Field name="password" type="text" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                  <ErrorMessage name="password" component="div" className="invalid-feedback" />
                </div>
              </div>
              {values.isRegister && (
                <>
                  <div className="row">
                    <div className="form-group col col-centered">
                      <label>Confirm Password</label>
                      <Field name="confirmPassword" type="text" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                      <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                    </div>
                  </div>
                  <div className="row text-center">
                    <div className="form-group col col-centered">
                      <label>Email</label>
                      <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                      <ErrorMessage name="email" component="div" className="invalid-feedback" />
                    </div>
                  </div>
                </>
              )}
              <button block="true" size="lg" type="submit">
                {values.isRegister ? 'Register' : 'Login'}
              </button>
              <div className="custom-control custom-checkbox">
                <label className="custom-control-label">
                  <Field name="isRegister" type="checkbox" checked={values.isRegister} className="custom-control-input" />
                  Register?
                </label>
                <ErrorMessage name="isRegister" component="div" className="invalid-feedback" />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
