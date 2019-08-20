import React from 'react';
import { TslpSeriesEditFormComp } from './TslpSeriesEditFormComp';
import { Formik, withFormik, FormikBag } from 'formik';
import { ITslpProps } from '../ITimeSeriesLinePlot';
import { IDashWidgetContentProps } from '../IDashWidgetContent';

export const TslpEditFormComp = (props) => {
    const {
        values,
        name,
        touched,
        handleChange,
        handleBlur,
        errors,
        setFieldValue,
        setFieldTouched
    } = props;
    return (
        <>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
                name={`${name}.title`}
            />

            {
                values.backgroundColor &&
                < input
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name={`${name}.backgroundColor`}
                    value={values.backgroundColor}

                />
            }

            <TslpSeriesEditFormComp
                name={`${name}.seriesList.0`}
                values={{ ...values.seriesList[0], points: [] }}
                touched={touched}
                errors={errors}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
            />
            {/* {
                values.seriesList.length > 0 &&
                values.seriesList.map((seriesObj, seriesIter) => {
                    console.log(`${(this as any)[name]}.seriesList.${seriesIter}`);
                    return (<TslpSeriesEditFormComp
                        name={`${(this as any)[name]}.seriesList.${seriesIter}`}
                        values={{ ...seriesObj, points: [] }}
                        touched={this.touched}
                        errors={this.errors}
                        handleChange={this.handleChange}
                        handleBlur={this.handleBlur}
                        setFieldValue={this.setFieldValue}
                        setFieldTouched={this.setFieldTouched}
                    />);
                }, { name, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched })
            } */}

        </>
    )
};

export const TslpEditForm = (props) => {
    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        isSubmitting
    } = props;
    let nameStr = 'tslpProps';
    return (
        <form onSubmit={handleSubmit}>
            <TslpEditFormComp
                name={nameStr}
                values={values[nameStr]}
                touched={touched}
                errors={errors}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
            />

            <button type="submit" disabled={isSubmitting}>Submit</button>

            <pre>{JSON.stringify(props, null, 2)}</pre>
        </form>
    )
};


export const FormikTslpEditForm = withFormik<{ ind: number, tslpProps: IDashWidgetContentProps, onFormSubmit }, {}, {}>({
    mapPropsToValues: (props) => ({
        tslpProps: { ...props.tslpProps }
    }),

    validate: values => {
        const errors = {};
        return errors;
    },

    handleSubmit: (values, { props, setSubmitting }) => {
        alert(JSON.stringify(values));
        props.onFormSubmit(values);
        setSubmitting(false);
    },

    displayName: 'TslpEditForm',
})(TslpEditForm);