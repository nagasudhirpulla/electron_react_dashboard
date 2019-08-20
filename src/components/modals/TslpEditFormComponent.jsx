import React from 'react';
import { withFormik } from 'formik';
import { VarTimeEditFormFragment } from './VarTimeEditFormFragment';

const TslpEditFormComp = (props) => {
    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        isSubmitting
    } = props;
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                name="name"
            />
            {errors.name && touched.name && <div className="form-error">{errors.name}</div>}

            <VarTimeEditFormFragment name='fromVarTime' value={values.fromVarTime} label='From Time' error={touched.fromVarTime && errors.fromVarTime} handleBlur={handleBlur} handleChange={handleChange} setFieldValue={setFieldValue}/>
            {errors.fromVarTime && touched.fromVarTime && <div className="form-error">{errors.fromVarTime}</div>}

            <VarTimeEditFormFragment name='toVarTime' value={values.toVarTime} label='To Time' error={touched.toVarTime && errors.toVarTime} handleBlur={handleBlur} handleChange={handleChange} setFieldValue={setFieldValue} />
            {errors.toVarTime && touched.toVarTime && <div className="form-error">{errors.toVarTime}</div>}

            <button type="submit" disabled={isSubmitting}>Submit</button>

            <pre>{JSON.stringify(props, null, 2)}</pre>
        </form>
    )
};

export const SeriesEditForm = withFormik({
    mapPropsToValues: ({ series }) => ({
        ...series,
    }),

    // Custom sync validation
    validate: values => {
        const errors = {};

        if (!values.name) {
            errors.name = 'Required';
        }

        return errors;
    },

    handleSubmit: (payload, { setSubmitting }) => {
        alert(JSON.stringify(payload));
        setSubmitting(false);
    },

    displayName: 'SeriesEditForm',
})(SeriesEditFormComp);