import React from 'react';
import { withFormik } from 'formik';
import { AppState } from '../IApp';

const WidgetContentDivider = () => (<div className="widget_content_divider"></div>);

export const AppSettingsEditFormComp = (props) => {
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
            <span>Scada API host -{" "}</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.scadaServerBase}
                name={`${name}.scadaServerBase`}
            />

            <WidgetContentDivider />

            <span>PMU API host -{" "}</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.pmuServerBase}
                name={`${name}.pmuServerBase`}
            />

            <WidgetContentDivider />

        </>
    )
};

export const AppSettingsEditForm = (props) => {
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
    let nameStr = 'appSettings';

    return (
        <div className="form_div black_border">
            <form onSubmit={handleSubmit}>
                <AppSettingsEditFormComp
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
            </form>
        </div>
    )
};


export const FormikAppSettingsEditForm = withFormik<{ appSettings: AppState["appSettings"], onFormSubmit }, { appSettings: AppState["appSettings"] }, { appSettings: AppState["appSettings"] }>({
    mapPropsToValues: (props) => ({
        appSettings: { ...props.appSettings }
    }),

    validate: values => {
        const errors = {};
        return errors;
    },

    handleSubmit: (values, { props, setSubmitting }) => {
        // alert(JSON.stringify(values));
        props.onFormSubmit(values.appSettings);
        setSubmitting(false);
    },

    displayName: 'AppSettingsEditForm',
})(AppSettingsEditForm);