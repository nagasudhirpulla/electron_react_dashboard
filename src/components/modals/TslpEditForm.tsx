import React from 'react';
import { TslpSeriesEditFormComp } from './TslpSeriesEditFormComp';
import { Formik, withFormik, FormikBag } from 'formik';
import { ITslpProps, TslpSeriesProps, ITslpSeriesProps, PlotlyRenderStrategy } from '../ITimeSeriesLinePlot';
import { IDashWidgetContentProps } from '../IDashWidgetContent';
import { PMUMeasurement } from '../../measurements/PMUMeasurement';
import { ScadaMeasurement } from '../../measurements/ScadaMeasurement';
import { DummyMeasurement } from '../../measurements/DummyMeasurement';
import { WbesMeasurement } from './../../measurements/WbesMeasurement';
import { ShowMessageBoxOptions } from 'electron';
import { AdaptersListItem } from '../../adapters/components/AdaptersList';
import { AdapterMeasurement } from '../../measurements/AdapterMeasurement';
const showConfirmationDialog = require('electron').remote.dialog.showMessageBox;

const WidgetContentDivider = () => (<div className="widget_content_divider"></div>);

export const TslpEditFormComp = (props) => {
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
    let TslpSeriesFormComps = [];
    for (let seriesIter = 0; seriesIter < values.seriesList.length; seriesIter++) {
        TslpSeriesFormComps.push(
            <>
                <div key={`tslpSeriesEditFormComp_${seriesIter}`} className="series_edit_item">
                    <TslpSeriesEditFormComp
                        name={`${name}.seriesList.${seriesIter}`}
                        values={{ ...values.seriesList[seriesIter], points: [] }}
                        touched={touched}
                        errors={errors}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        onDeleteClick={onDeleteSeriesClick(seriesIter)}
                        onDuplicateClick={onDuplicateSeriesClick(seriesIter)}
                        onTimeOverwriteClick={onTimeOverwriteSeriesClick(seriesIter)}
                    />
                </div>
                <WidgetContentDivider />
            </>
        );
    }

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

            {TslpSeriesFormComps}
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
    const onAddSeriesClick = () => {
        let seriesProps = new TslpSeriesProps();
        seriesProps.fromVarTime.absoluteTime = new Date().getTime() - 4 * 60 * 1000;
        seriesProps.toVarTime.absoluteTime = new Date().getTime() - 2 * 60 * 1000;
        if (values.newMeasType == ScadaMeasurement.typename) {
            seriesProps.meas = new ScadaMeasurement();
        } else if (values.newMeasType == PMUMeasurement.typename) {
            seriesProps.renderStrategy = PlotlyRenderStrategy.scattergl;
            seriesProps.meas = new PMUMeasurement();
        } else if (values.newMeasType == DummyMeasurement.typename) {
            seriesProps.meas = new DummyMeasurement();
        } else if (values.newMeasType == WbesMeasurement.typename) {
            seriesProps.meas = new WbesMeasurement();
        } else {
            // We assume that it is Data Adapter
            seriesProps.meas = new AdapterMeasurement();
            (seriesProps.meas as AdapterMeasurement).adapter_id = values.newMeasType;
        }
        setFieldValue(`${nameStr}.seriesList`, [...values[nameStr].seriesList, seriesProps]);
    };

    const onDeleteSeriesClick = (ind: number) => {
        return () => {
            const dialogOptions = { type: "info", title: "Confirm Series Delete", buttons: ['OK', 'Cancel'], message: 'Delete Series?' };
            showConfirmationDialog(null, dialogOptions as ShowMessageBoxOptions, i => {
                // console.log(i);
                if (i == 0) {
                    setFieldValue(`${nameStr}.seriesList`,
                        [
                            ...values[nameStr].seriesList.slice(0, ind),
                            ...values[nameStr].seriesList.slice(ind + 1)
                        ]
                    );
                }
            });
        }
    };

    const onDuplicateSeriesClick = (ind: number) => {
        return () => {
            const newSeries = { ...values[nameStr].seriesList[ind] };
            setFieldValue(`${nameStr}.seriesList`,
                [
                    ...values[nameStr].seriesList.slice(0, ind + 1),
                    newSeries,
                    ...values[nameStr].seriesList.slice(ind + 1)
                ]
            );
        }
    };

    const onTimeOverwriteSeriesClick = (ind: number) => {
        return () => {
            let newSeriesList = [...values[nameStr].seriesList] as ITslpSeriesProps[];
            for (let serIter = 0; serIter < newSeriesList.length; serIter++) {
                if (serIter == ind) {
                    continue;
                }
                newSeriesList[serIter].fromVarTime = { ...newSeriesList[ind].fromVarTime }
                newSeriesList[serIter].toVarTime = { ...newSeriesList[ind].toVarTime }
            }

            setFieldValue(`${nameStr}.seriesList`, newSeriesList);
        }
    };
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
                <button type="button" onClick={onAddSeriesClick} className='duplicate_series_btn'>Add Series</button>
            </div>
            <div>
                <TslpEditFormComp
                    name={nameStr}
                    values={values[nameStr]}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    onDeleteSeriesClick={onDeleteSeriesClick}
                    onDuplicateSeriesClick={onDuplicateSeriesClick}
                    onTimeOverwriteSeriesClick={onTimeOverwriteSeriesClick}
                />

                <button type="submit" disabled={isSubmitting}>Submit</button>

                {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
            </div>
        </form>
    )
};


export const FormikTslpEditForm = withFormik<{ ind: number, tslpProps: ITslpProps, adapters: AdaptersListItem[], onFormSubmit }, { tslpProps: ITslpProps }, { tslpProps: ITslpProps, newMeasType: string, adapters: AdaptersListItem[] }>({
    mapPropsToValues: (props) => ({
        tslpProps: JSON.parse(JSON.stringify(props.tslpProps)),
        newMeasType: ScadaMeasurement.typename,
        adapters: props.adapters
    }),

    validate: values => {
        const errors = {};
        return errors;
    },

    handleSubmit: (values, { props, setSubmitting }) => {
        // alert(JSON.stringify(values));
        props.onFormSubmit(values.tslpProps, props.ind);
        setSubmitting(false);
    },

    displayName: 'TslpEditForm',
})(TslpEditForm);