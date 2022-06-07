import React from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import * as Yup from 'yup';
import Header from "./Header";
import { axiosHelper } from "../utils";


const RecipeForm = props => {
  let initialValues = {
    name: '',
    description: '',
    serving: 1,
    ingredients: [],
    instructions: [],
    nutrition: [],
  };
  const { recipeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { activeRecipe } = location.state || {};
  if (activeRecipe) initialValues = activeRecipe;
  console.log("recipeForm props", props, location, recipeId, initialValues);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Recipe name is required'),
    description: Yup.string()
      .required('description is required'),
    ingredients: Yup.array().of(
      Yup.object().shape({
        name: Yup.string()
          .required('ingredient is required'),
        quantity: Yup.number()
          .required('quantity is required'),
        uom: Yup.string(),
        description: Yup.string().nullable()
      }),
    ),
    instructions: Yup.array().of(
      Yup.object().shape({
        sequence: Yup.number()
          .required('is required'),
        description: Yup.string()
          .required('description is required'),
      })
    )
  });

  function addItem(e, prop, values, setValues) {
    // update dynamic form
    const relation = [...values[prop]];
    relation.push({ _isAdding: true });
    setValues({ ...values, [prop]: relation });
  }
  async function deleteItem(e, prop, idx, item, arrayHelpers) {
    let allow = item._isAdding;
    if (!allow) {
      // we need to delete from DB first.
      const { data } = await axiosHelper({
        url: `/api/${prop}/${item.id}`,
        method: 'delete',
      });
      console.log("DELETE", data);
      allow = !!data;
    }
    // if we added the item client side (and not saved)
    // it is safe to remove
    if (allow) arrayHelpers.remove(idx);
  }
  // to back go to previous page
  const goHome = () => navigate(-1);

  const onSubmit = async (fields) => {
    // display form field values on success
    console.log('SUCCESS!! passed yup tests', fields);
    const options = {
        method: 'post', 
        data: fields
      }

    if (!recipeId) {
      options.url = '/api/createSmoothie';
    }
    else {
      options.url = `/api/Recipe/${activeRecipe.id}`;
      options.method = 'put';

    }
    const res = await axiosHelper(options);
    console.log("RESULT", res)
    navigate(`/smoothie/${recipeId || res.data.recipe_id}`, { replace: true });
  }
  let button;
  if (recipeId) {
    button = <button className="btn btn-secondary mr-1" type="button" onClick={goHome}>Cancel</button>
  }
  else {
    button = <>
      <button className="btn btn-secondary mr-1" type="reset">Reset</button>
      <button className="btn btn-secondary mr-1" type="button" onClick={goHome}>Cancel</button>
    </>
  }
  return (
    <div className="App">
      <Header />
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ errors, values, touched, setValues }) => (
          <Form>
            <div className="card m-3">
              <h5 className="card-header">Create your next smoothie recipe and share it with the world!</h5>
              <div className="card-body border-bottom">
                <div className="form-row">
                  <div className="form-group col-6">
                    <label>Smoothie Name</label>
                    <Field name="name" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} />
                    <ErrorMessage name="name" component="div" className="invalid-feedback" />
                  </div>
                  <div className="form-group col-6">
                    <label>Serving #</label>
                    <Field name="serving" type="number" className={'form-control' + (errors.serving && touched.serving ? ' is-invalid' : '')} />
                    <ErrorMessage name="serving" component="div" className="invalid-feedback" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-12">
                    <label>Smoothie Description</label>
                    <Field name="description" as="textarea" rows="4" className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} />
                    <ErrorMessage name="description" component="div" className="invalid-feedback" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-2">
                    <button
                      className='form-control btn btn-info'
                      type="button"
                      onClick={(e) => addItem(e, 'ingredients', values, setValues)}>
                      Add Ingredient
                    </button>
                  </div>
                  <div className="form-group col-2">
                    <button
                      className='form-control btn btn-info'
                      type="button"
                      onClick={(e) => addItem(e, 'instructions', values, setValues)}>
                      Add Instruction
                    </button>
                  </div>
                </div>
              </div>
              <FieldArray name="ingredients">
                {(arrayHelpers) => (values.ingredients.map((item, i) => {
                  const itemsErrors = errors.ingredients?.length && errors.ingredients[i] || {};
                  const itemsTouched = touched.ingredients?.length && touched.ingredients[i] || {};
                  return (
                    <div key={i} className="list-group list-group-flush">
                      <div className="list-group-item">
                        <h5 className="card-title">Ingredient #{i + 1}</h5>
                        <div className="form-row">
                          <div className="form-group col-1">
                            <label>Qty</label>
                            <Field name={`ingredients.${i}.quantity`} type="text" className={'form-control' + (itemsErrors.quantity && itemsTouched.quantity ? ' is-invalid' : '')} />
                            <ErrorMessage name={`ingredients.${i}.quantity`} component="div" className="invalid-feedback" />
                          </div>
                          <div className="form-group col-1">
                            <label>UOM</label>
                            <Field name={`ingredients.${i}.uom`} type="text" className={'form-control' + (itemsErrors.uom && itemsTouched.uom ? ' is-invalid' : '')} />
                            <ErrorMessage name={`ingredients.${i}.uom`} component="div" className="invalid-feedback" />
                          </div>
                          <div className="form-group col">
                            <label>Name</label>
                            <Field name={`ingredients.${i}.name`} type="text" className={'form-control' + (itemsErrors.name && itemsTouched.name ? ' is-invalid' : '')} />
                            <ErrorMessage name={`ingredients.${i}.name`} component="div" className="invalid-feedback" />
                          </div>
                          <div className="form-group col-1">
                            <label>[ - ]</label>
                            <button
                              className='form-control btn btn-danger'
                              type="button"
                              onClick={(e) => deleteItem(e, 'Ingredient', i, item, arrayHelpers)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                              </svg>
                            </button>
                            <ErrorMessage name={`ingredients.${i}.uom`} component="div" className="invalid-feedback" />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group col-12">
                            <label>Comment/Description</label>
                            <Field name={`ingredients.${i}.description`} as="textarea" rows="2" className={'form-control' + (itemsErrors.description && itemsTouched.description ? ' is-invalid' : '')} />
                            <ErrorMessage name={`ingredients.${i}.description`} component="div" className="invalid-feedback" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }))}
              </FieldArray>
              <FieldArray name="instructions">
                {(arrayHelpers) => (values.instructions.map((item, i) => {
                  const itemsErrors = errors.instructions?.length && errors.instructions[i] || {};
                  const itemsTouched = touched.instructions?.length && touched.instructions[i] || {};
                  return (
                    <div key={i} className="list-group list-group-flush">
                      <div className="list-group-item">
                        <h5 className="card-title">Instruction (step: {i + 1})</h5>
                        <div className="form-row">
                          <div className="form-group col-1">
                            <label>Sequence #</label>
                            <Field name={`instructions.${i}.sequence`} type="text" className={'form-control' + (itemsErrors.sequence && itemsTouched.sequence ? ' is-invalid' : '')} />
                            <ErrorMessage name={`instructions.${i}.sequence`} component="div" className="invalid-feedback" />
                          </div>
                          <div className="form-group col">
                            <label>description</label>
                            <Field name={`instructions.${i}.description`} as="textarea" rows="3" className={'form-control' + (itemsErrors.description && itemsTouched.description ? ' is-invalid' : '')} />
                            <ErrorMessage name={`instructions.${i}.description`} component="div" className="invalid-feedback" />
                          </div>
                          <div className="form-group col-1">
                            <label>[ - ]</label>
                            <button
                              className='form-control btn btn-danger'
                              type="button"
                              onClick={(e) => deleteItem(e, 'Instruction', i, item, arrayHelpers)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                              </svg>
                            </button>
                            <ErrorMessage name={`ingredients.${i}.delete`} component="div" className="invalid-feedback" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }))}
              </FieldArray>              
              <div className="card-footer text-center border-top-0">
                <button type="submit" className="btn btn-primary mr-1">
                  { recipeId ? 'Update' : 'Create' }
                </button>
                {button}
              </div>
            </div>
          </Form>
        )}
      </Formik>
      </div>
  )
}

export default RecipeForm;
