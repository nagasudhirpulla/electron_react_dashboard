import React from 'react';
import { Formik, FormikProps, Form, Field, ErrorMessage } from 'formik';
import { TslpProps } from '../ITimeSeriesLinePlot';
import { TsscProps } from '../ITimeSeriesScatterPlot';
import { TsTextProps } from '../ITimeSeriesText';

//https://programmingwithmosh.com/javascript/create-modal-using-react/
interface WidgetAddFormProps {
    onFormSubmit(formRes: string): void
}
interface WidgetAddFormValues {
    widgetType: string
}

export class WidgetAddForm extends React.Component<WidgetAddFormProps, {}> {

    handleSubmit = (values: WidgetAddFormValues, {
        onFormSubmit = this.props.onFormSubmit,
        setSubmitting
    }) => {
        // alert(JSON.stringify(values, null, 2));

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
                validate={(values: WidgetAddFormValues) => {
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
                                name="widgetType"
                                component="select"
                                placeholder="Select Widget Type">
                                <option value={null}>Select Widget Type</option>
                                <option value={TslpProps.typename}>Timeseries</option>
                                <option value={TsscProps.typename}>Scatter</option>
                                <option value={TsTextProps.typename}>Text</option>
                                <option value="Blank">Blank</option>
                            </Field>
                            <ErrorMessage name="widgetType" />

                            <button
                                type="submit"
                                disabled={formProps.isSubmitting}>
                                Add Widget
                            </button>
                        </Form>
                    );
                }}
            />);
    }
}