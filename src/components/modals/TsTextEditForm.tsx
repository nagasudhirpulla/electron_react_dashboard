import React from 'react';
import { Formik, withFormik, FormikBag } from 'formik';
// import { IDashWidgetContentProps } from '../IDashWidgetContent';
import { PMUMeasurement } from '../../measurements/PMUMeasurement';
import { ScadaMeasurement } from '../../measurements/ScadaMeasurement';
import { DummyMeasurement } from '../../measurements/DummyMeasurement';
import { WbesMeasurement } from './../../measurements/WbesMeasurement';
import { AdaptersListItem } from '../../adapters/components/AdaptersList';
import { AdapterMeasurement } from '../../measurements/AdapterMeasurement';
import { ITsTextProps } from '../ITimeSeriesText';
const showConfirmationDialog = require('electron').remote.dialog.showMessageBox;

const WidgetContentDivider = () => (<div className="widget_content_divider"></div>);

export const TsTextEditFormComp = (props) => {
    const {
        values,
        onDeleteSeriesClick,
        onDuplicateSeriesClick,
        onTimeOverwriteSeriesClick,
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
            <span>Title{" "}</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
                name={`${name}.title`}
            />

            <WidgetContentDivider />

            <span>Background Color{" "}</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                name={`${name}.backgroundColor`}
                value={values.backgroundColor}
            />
            <WidgetContentDivider />

            <span>Text Color{" "}</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                name={`${name}.titleColor`}
                value={values.titleColor}
            />
            <WidgetContentDivider />

            <span>Border{" "}</span>
            <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                name={`${name}.border`}
                value={values.border}
            />
        </>
    )
};

export const TsTextEditForm = (props) => {
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
    let nameStr = 'tsTextProps';

    let measOptionEls = [];
    for (let measTypeInd = 0; measTypeInd < values.adapters.length; measTypeInd++) {
        const optEl = <option value={values.adapters[measTypeInd].adapter_id}>{values.adapters[measTypeInd].name}</option>;
        measOptionEls.push(optEl);
    }

    return (
        <form className="form_div" onSubmit={handleSubmit}>
            <div>
                <select
                    name="newMeasType"
                    value={values.newMeasType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                >
                    <option value={ScadaMeasurement.typename}>Scada</option>
                    <option value={PMUMeasurement.typename}>PMU</option>
                    <option value={WbesMeasurement.typename}>WBES</option>
                    <option value={DummyMeasurement.typename}>Random</option>
                    {measOptionEls}
                </select>
                <button type="button" onClick={() => { }} className='duplicate_series_btn'>Change Measurement Type</button>
            </div>
            <div>
                <TsTextEditFormComp
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


export const FormikTsTextEditForm = withFormik<{ ind: number, tsTextProps: ITsTextProps, adapters: AdaptersListItem[], onFormSubmit }, { tsTextProps: ITsTextProps }, { tsTextProps: ITsTextProps, newMeasType: string, adapters: AdaptersListItem[] }>({
    mapPropsToValues: (props) => ({
        tsTextProps: JSON.parse(JSON.stringify(props.tsTextProps)),
        newMeasType: ScadaMeasurement.typename,
        adapters: props.adapters
    }),

    validate: values => {
        const errors = {};
        return errors;
    },

    handleSubmit: (values, { props, setSubmitting }) => {
        // alert(JSON.stringify(values));
        props.onFormSubmit(values.tsTextProps, props.ind);
        setSubmitting(false);
    },

    displayName: 'TsTextEditForm',
})(TsTextEditForm);