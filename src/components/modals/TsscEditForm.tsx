import React from 'react';
import { TsscSeriesEditFormComp } from './TsscSeriesEditFormComp';
import { Formik, withFormik, FormikBag } from 'formik';
import { ITsscProps, TsscSeriesProps, ITsscSeriesProps } from '../ITimeSeriesScatterPlot';
import { PlotlyRenderStrategy } from '../ITimeSeriesLinePlot';
// import { IDashWidgetContentProps } from '../IDashWidgetContent';
import { PMUMeasurement } from '../../measurements/PMUMeasurement';
import { ScadaMeasurement } from '../../measurements/ScadaMeasurement';
import { DummyMeasurement } from '../../measurements/DummyMeasurement';
import { WbesMeasurement } from './../../measurements/WbesMeasurement';
import { ShowMessageBoxOptions } from 'electron';
const showConfirmationDialog = require('electron').remote.dialog.showMessageBox;

const WidgetContentDivider = () => (<div className="widget_content_divider"></div>);

export const TsscEditFormComp = (props) => {
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
    let TsscSeriesFormComps = [];
    for (let seriesIter = 0; seriesIter < values.seriesList.length; seriesIter++) {
        TsscSeriesFormComps.push(
            <>
                <div key={`tsscSeriesEditFormComp_${seriesIter}`} className="series_edit_item">
                    <TsscSeriesEditFormComp
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

            {TsscSeriesFormComps}
        </>
    )
};

export const TsscEditForm = (props) => {
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
    let nameStr = 'tsscProps';
    const onAddSeriesClick = () => {
        let seriesProps = new TsscSeriesProps();
        seriesProps.fromVarTime.absoluteTime = new Date().getTime() - 4 * 60 * 1000;
        seriesProps.toVarTime.absoluteTime = new Date().getTime() - 2 * 60 * 1000;
        if (values.newMeas1Type == ScadaMeasurement.typename) {
            seriesProps.meas1 = new ScadaMeasurement();
        } else if (values.newMeas1Type == PMUMeasurement.typename) {
            seriesProps.renderStrategy = PlotlyRenderStrategy.scattergl;
            seriesProps.meas1 = new PMUMeasurement();
        } else if (values.newMeas1Type == DummyMeasurement.typename) {
            seriesProps.meas1 = new DummyMeasurement();
        } else if (values.newMeas1Type == WbesMeasurement.typename) {
            seriesProps.meas1 = new WbesMeasurement();
        }

        if (values.newMeas2Type == ScadaMeasurement.typename) {
            seriesProps.meas2 = new ScadaMeasurement();
        } else if (values.newMeas2Type == PMUMeasurement.typename) {
            seriesProps.renderStrategy = PlotlyRenderStrategy.scattergl;
            seriesProps.meas2 = new PMUMeasurement();
        } else if (values.newMeas2Type == DummyMeasurement.typename) {
            seriesProps.meas2 = new DummyMeasurement();
        } else if (values.newMeas2Type == WbesMeasurement.typename) {
            seriesProps.meas2 = new WbesMeasurement();
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
            let newSeriesList = [...values[nameStr].seriesList] as ITsscSeriesProps[];
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

    return (
        <form className="form_div" onSubmit={handleSubmit}>
            <div>
                <select
                    name="newMeas1Type"
                    value={values.newMeas1Type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                >
                    <option value={ScadaMeasurement.typename}>Scada</option>
                    <option value={PMUMeasurement.typename}>PMU</option>
                    <option value={WbesMeasurement.typename}>WBES</option>
                    <option value={DummyMeasurement.typename}>Random</option>
                </select>
                <select
                    name="newMeas2Type"
                    value={values.newMeas2Type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                >
                    <option value={ScadaMeasurement.typename}>Scada</option>
                    <option value={PMUMeasurement.typename}>PMU</option>
                    <option value={WbesMeasurement.typename}>WBES</option>
                    <option value={DummyMeasurement.typename}>Random</option>
                </select>
                <button type="button" onClick={onAddSeriesClick} className='duplicate_series_btn'>Add Series</button>
            </div>
            <div>
                <TsscEditFormComp
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


export const FormikTsscEditForm = withFormik<{ ind: number, tsscProps: ITsscProps, onFormSubmit }, { tsscProps: ITsscProps }, { tsscProps: ITsscProps, newMeas1Type: string, newMeas2Type: string }>({
    mapPropsToValues: (props) => ({
        tsscProps: JSON.parse(JSON.stringify(props.tsscProps)),
        newMeas1Type: ScadaMeasurement.typename,
        newMeas2Type: ScadaMeasurement.typename
    }),

    validate: values => {
        const errors = {};
        return errors;
    },

    handleSubmit: (values, { props, setSubmitting }) => {
        // alert(JSON.stringify(values));
        props.onFormSubmit(values.tsscProps, props.ind);
        setSubmitting(false);
    },

    displayName: 'TsscEditForm',
})(TsscEditForm);