import React from 'react';
import { Formik, FormikProps, Form, Field, ErrorMessage } from 'formik';
import { TslpProps, ITslpSeriesProps, TslpSeriesProps } from '../ITimeSeriesLinePlot';
import { values } from 'd3';

//https://programmingwithmosh.com/javascript/create-modal-using-react/
interface TslpSeriesAddFormProps {
    onFormSubmit(formRes: ITslpSeriesProps, ind: number): void,
    ind: number
}
interface TslpSeriesAddFormValues {
    tslpSeriesProps: ITslpSeriesProps
}

export class TslpSeriesAddForm extends React.Component<TslpSeriesAddFormProps, {}> {

    handleSubmit = (values: TslpSeriesAddFormValues, {
        onFormSubmit = this.props.onFormSubmit,
        setSubmitting
    }) => {
        // alert(JSON.stringify(values, null, 2));

        // call parent function to return
        onFormSubmit(values.tslpSeriesProps, this.props.ind);

        setSubmitting(true);
        return;
    }

    render() {

        return (
            <Formik
                initialValues={{
                    tslpSeriesProps: new TslpSeriesProps()
                }}
                validate={(values: TslpSeriesAddFormValues) => {
                    let errors = {};

                    if (!values.tslpSeriesProps.color)
                        errors['widgetType'] = "Please input a color...";
                    //check if my values have errors
                    return errors;
                }}
                onSubmit={this.handleSubmit}
                render={formProps => {
                    return (
                        <Form>
                            <Field
                                name="tslpSeriesProps.color"
                                type="text"
                                placeholder="Select Series Color">
                            </Field>
                            <ErrorMessage name="tslpSeriesProps.color" />

                            <button
                                type="submit"
                                disabled={formProps.isSubmitting}>
                                Add Series
                            </button>
                        </Form>
                    );
                }}
            />);
    }
}