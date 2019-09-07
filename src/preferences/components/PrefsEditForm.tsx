import React from 'react';
import { Formik, withFormik, FormikBag } from 'formik';
import { ISettings } from '../../appSettings';


const ContentDivider = () => (<div className="widget_content_divider"></div>);

export const PrefsEditFormComp = (props) => {
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
            <h4>PMU Soap Api Configuration</h4>
            <span>Host</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.pmu.soap.host}
                name={`${name}.pmu.soap.host`}
            />

            <ContentDivider />

            <span>Port</span>
            <input
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.pmu.soap.port}
                name={`${name}.pmu.soap.port`}
            />

            <span>Username</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.pmu.soap.username}
                name={`${name}.pmu.soap.username`}
            />

            <span>Password</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.pmu.soap.password}
                name={`${name}.pmu.soap.password`}
            />

            <h4>WBES Fetch Configuration</h4>
            <span>Host</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.wbes.host}
                name={`${name}.wbes.host`}
            />
        </>
    )
};

export const PrefsEditForm = (props) => {
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
    let nameStr = 'prefs';

    return (
        <form className="form_div" onSubmit={handleSubmit}>
            <div>
                <PrefsEditFormComp
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

                {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
            </div>
        </form>
    )
};


export const FormikPrefsEditForm = withFormik<{ prefs: ISettings, onFormSubmit }, { prefs: ISettings }, { prefs: ISettings }>({
    mapPropsToValues: (props) => ({
        prefs: JSON.parse(JSON.stringify(props.prefs))
    }),

    validate: values => {
        const errors = {};
        return errors;
    },

    handleSubmit: (values, { props, setSubmitting }) => {
        // alert(JSON.stringify(values));
        props.onFormSubmit(values.prefs);
        setSubmitting(false);
    },

    displayName: 'PrefsEditForm',
})(PrefsEditForm);