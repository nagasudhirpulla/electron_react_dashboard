import React from 'react';
import { withFormik } from 'formik';
import { AppState } from '../IApp';
import { TimePeriodEditFormComp } from './TimePeriodEditFormComp';

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
    }: { values: { appSettings: AppState["appSettings"], timerSettings: AppState["timerSettings"], boardSettings: AppState["boardSettings"] }, [key: string]: any } = props;

    return (
        <>
            {/* <span>Scada API host -{" "}</span>
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

            <WidgetContentDivider /> */}

            <span>Periodic Fetch{" "}</span>
            <input
                type="checkbox"
                onChange={handleChange}
                onBlur={handleBlur}
                checked={values.timerSettings.timerOn}
                name={`${name}.timerSettings.timerOn`}
            />

            <WidgetContentDivider />

            <span>Background Color{" "}</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.boardSettings.backgroundColor}
                name={`${name}.boardSettings.backgroundColor`}
            />

            <WidgetContentDivider />

            <span>Fetch Periodicity -{" "}</span>
            <TimePeriodEditFormComp
                name={`${name}.timerSettings.timerPeriodicity`}
                values={values.timerSettings.timerPeriodicity}
                errors={errors}
                touched={touched}
                handleBlur={handleBlur}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched} />

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
    let nameStr = 'settings';

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


export const FormikAppSettingsEditForm = withFormik<{ appSettings: AppState["appSettings"], timerSettings: AppState["timerSettings"], boardSettings: AppState["boardSettings"], onFormSubmit }, { settings: { appSettings: AppState["appSettings"], timerSettings: AppState["timerSettings"], boardSettings: AppState["boardSettings"] } }, { appSettings: AppState["appSettings"], timerSettings: AppState["timerSettings"], boardSettings: AppState["boardSettings"] }>({
    mapPropsToValues: (props) => ({
        settings: {
            appSettings: { ...props.appSettings },
            timerSettings: { ...props.timerSettings },
            boardSettings: { ...props.boardSettings }
        }
    }),

    validate: values => {
        const errors = {};
        return errors;
    },

    handleSubmit: (values, { props, setSubmitting }) => {
        // alert(JSON.stringify(values));
        props.onFormSubmit({ ...values.settings });
        setSubmitting(false);
    },

    displayName: 'AppSettingsEditForm',
})(AppSettingsEditForm);