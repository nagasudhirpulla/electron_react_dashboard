import React from 'react';
import { Formik, FormikProps, Form, Field, ErrorMessage } from 'formik';
import { TslpProps } from '../ITimeSeriesLinePlot';
        
//https://programmingwithmosh.com/javascript/create-modal-using-react/
interface WidgetSelectFormProps {
    onFormSubmit(formRes: string):void,
    formId: string
}
interface WidgetSelectFormValues {
    widgetType: string
}

export class WidgetSelectForm extends React.Component<WidgetSelectFormProps, {}> {

    handleSubmit = (values: WidgetSelectFormValues, {
        onFormSubmit = this.props.onFormSubmit,
        formId = this.props.formId,
        setSubmitting
    }) => {
        alert(JSON.stringify(values, null, 2));

        // call parent function to return
        onFormSubmit(values.widgetType);
        
        setSubmitting(false);
        return;
    }

    render() {

        return (
            <Formik
                initialValues={{
                    widgetType: ''
                }}
                validate={(values: WidgetSelectFormValues) => {
                    let errors = {};

                    if (!values.widgetType)
                        errors['widgetType'] = "Please select a widget type...";
                    //check if my values have errors
                    return errors;
                }}
                onSubmit={this.handleSubmit}
                render={formProps => {
                    return (
                        <Form>
                            <Field
                                name="Widget Type"
                                component="select"
                                placeholder="Select Widget Type">
                                <option value={TslpProps.typename}>{TslpProps.typename}</option>
                                <option value="Blank">Blank</option>
                            </Field>
                            <ErrorMessage name="widgetType" />

                            <button
                                type="submit"
                                disabled={formProps.isSubmitting}>
                                Submit Form
                            </button>
                        </Form>
                    );
                }}
            />);
    }
}