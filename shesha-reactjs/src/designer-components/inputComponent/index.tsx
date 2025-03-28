import React, { FC, useCallback, useState } from 'react';
import { Alert, AutoComplete, Button, Input, InputNumber, Radio, Select, Space, Switch, Tooltip } from "antd";
import { EditableTagGroup, EndpointsAutocomplete, FormComponentSelector, ButtonGroupConfigurator, CodeEditor, ColorPicker, FormAutocomplete, IconType, LabelValueEditor, PermissionAutocomplete, SectionSeparator, ShaIcon } from '@/components';
import { PropertyAutocomplete } from '@/components/propertyAutocomplete/propertyAutocomplete';
import { IObjectMetadata } from '@/interfaces/metadata';
import { evaluateString, evaluateValue, executeScript, useAvailableConstantsData, useFormData, useMetadata } from '@/index';
import { ICodeEditorProps } from '@/designer-components/codeEditor/interfaces';
import { useMetadataBuilderFactory } from '@/utils/metadata/hooks';
import camelcase from 'camelcase';
import { CodeEditorWithStandardConstants } from '@/designer-components/codeEditor/codeEditorWithConstants';
import { MultiColorInput } from '@/designer-components/multiColorInput';
import { useStyles } from './styles';
import { customIcons } from './icons';
import { defaultExposedVariables } from '../_settings/settingsControl';
import { getValueFromString } from '../settingsInput/utils';
import CustomDropdown from '../_settings/utils/CustomDropdown';
import { Autocomplete } from '@/components/autocomplete';
import { ContextPropertyAutocomplete } from '../contextPropertyAutocomplete';
import { ISettingsInputProps } from '../settingsInput/interfaces';
import { QueryBuilderWrapper } from '../queryBuilder/queryBuilderWrapper';
import { QueryBuilder } from '../queryBuilder/queryBuilder';
import { ColumnsConfig } from '../dataTable/table/columnsEditor/columnsConfig';
import { DynamicActionsConfigurator } from '../dynamicActionsConfigurator/configurator';
import { ImagePicker } from '../imagePicker';
import ReferenceListAutocomplete from '@/components/referenceListAutocomplete';
import { IconPickerWrapper } from '../iconPicker/iconPickerWrapper';
import ColumnsList from '../columns/columnsList';
import SizableColumnsList from '../sizableColumns/sizableColumnList';
import { FiltersList } from '../dataTable/tableViewSelector/filters/filtersList';
import { ItemListConfiguratorModal } from '../itemListConfigurator/itemListConfiguratorModal';
import { ITabPaneProps } from '../tabs/models';
import { IWizardStepProps } from '../wizard/models';
import { ConfigurableActionConfigurator } from '../configurableActionsConfigurator/configurator';
import { formTypes } from '../entityReference/settings';
import { SortingEditor } from '@/components/dataTable/sortingConfigurator';
import RefListItemSelectorSettingsModal from '@/providers/refList/options/modal';
import { FormLayout } from 'antd/es/form/Form';
import { startCase } from 'lodash';
import MyAutoComplete from '../dataList/utils';

export const InputComponent: FC<Omit<ISettingsInputProps, 'hidden'>> = (props) => {
    const icons = require('@ant-design/icons');
    const { styles } = useStyles();

    const [formTypesOptions, setFormTypesOptions] = useState<{ value: string }[]>(
        formTypes.map((i) => {
            return { value: i };
        })
    );

    const metadataBuilderFactory = useMetadataBuilderFactory();
    const { data: formData } = useFormData();
    const { size, className, value, placeholder, type, dropdownOptions, buttonGroupOptions, defaultValue, componentType,
        propertyName, tooltip: description, onChange, readOnly, label, availableConstantsExpression, noSelectionItemText, noSelectionItemValue,
        allowClear, dropdownMode, variant, icon, iconAlt, tooltip, dataSourceType, dataSourceUrl, onAddNewItem, listItemSettingsMarkup, propertyAccessor, referenceList } = props;

    const iconElement = (icon: string | React.ReactNode, size?: any, hint?: string, style?: React.CSSProperties) => {
        if (typeof icon !== 'string') {
            return icon;
        }

        if (icons[icon]) {
            return (
                <Tooltip title={hint}>
                    <ShaIcon iconName={icon as IconType} style={style} />
                </Tooltip>
            );
        }

        if (customIcons[icon]) {
            return (
                <Tooltip className={styles.icon} title={hint ?? startCase(propertyName.split('.')[1])}>
                    <span style={style}>{customIcons[icon]}</span>
                </Tooltip>
            );
        }

        if (icon === 'sectionSeparator') {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    verticalAlign: 'middle',
                    top: 10
                }}>
                    <Space>
                        {size}
                        <Tooltip className={styles.icon} title={hint}>
                            <SectionSeparator
                                containerStyle={{ margin: 0 }}
                                lineThickness={Number(size[0]) / 2}
                                lineWidth='20'
                                lineColor='#000'
                                fontSize={14}
                                marginBottom='0px'
                            />
                        </Tooltip>
                    </Space>
                </div>
            );
        }

        return icon;
    };

    const allData = useAvailableConstantsData();

    const constantsAccessor = useCallback((): Promise<IObjectMetadata> => {
        if (!availableConstantsExpression?.trim())
            return Promise.reject("AvailableConstantsExpression is mandatory");

        const metadataBuilder = metadataBuilderFactory();

        return executeScript<IObjectMetadata>(availableConstantsExpression, { data: formData, metadataBuilder });
    }, [availableConstantsExpression, metadataBuilderFactory, formData]);

    const functionName = `get${camelcase(propertyName, { pascalCase: true })}`;

    const codeEditorProps: ICodeEditorProps = {
        readOnly: readOnly,
        description: description,
        mode: 'dialog',
        language: 'typescript',
        fileName: propertyName,
        label: label ?? propertyName,
        wrapInTemplate: true,
        value: value,
        onChange: onChange,
        templateSettings: { functionName: functionName },
        exposedVariables: defaultExposedVariables
    };

    const property = propertyAccessor
        ? evaluateString(propertyAccessor, { data: formData })
        : null;

    const meta = useMetadata(false);

    const propertyMeta = property && meta
        ? meta.getPropertyMeta(property)
        : null;

    const editModes = [
        { value: 'editable', icon: 'editIcon', title: 'Editable' },
        { value: 'readOnly', icon: 'readonlyIcon', title: 'Read only' },
        { value: 'inherited', icon: 'inheritIcon', title: 'Inherit' }
    ];

    const editor = availableConstantsExpression?.trim()
        ? <CodeEditor {...codeEditorProps} availableConstants={constantsAccessor} />
        : <CodeEditorWithStandardConstants {...codeEditorProps} />;

    const verb = props.httpVerb ? evaluateValue(props.httpVerb, { data: formData }) : props.httpVerb;

    switch (type) {
        case 'myAutocomplete':
            console.log('myAutocomplete', { ...props });
            return <MyAutoComplete {...props}/>;
        case 'tooltip':
            return iconElement(icon, null, tooltip);
        case 'dataSortingEditor':
            return <SortingEditor {...props} onChange={onChange} modelType={props.modelType} readOnly={readOnly} />;
        case 'colorPicker':
            return <ColorPicker size={size} value={value} readOnly={readOnly} allowClear onChange={onChange} showText={props.showText} />;
        case 'dropdown':
            return <Select
                size={size}
                mode={dropdownMode}
                allowClear={allowClear}
                disabled={readOnly}
                variant={variant}
                className={className}
                value={value}
                style={{ width: "100%" }}
                defaultValue={defaultValue}
                onChange={
                    onChange}
                options={typeof dropdownOptions === 'string' ?
                    getValueFromString(dropdownOptions) :
                    dropdownOptions.map(option => ({ ...option, label: iconElement(option.label, option.value, tooltip) }))}
            />;
        case 'radio':
            return <Radio.Group buttonStyle='solid' defaultValue={defaultValue} value={value} onChange={onChange} size={size} disabled={readOnly}>
                {
                    buttonGroupOptions.map(({ value, icon, title }) => {
                        return <Radio.Button key={value} value={value}>{iconElement(icon, null, title)}</Radio.Button>;
                    })}
            </Radio.Group>;
        case 'switch':
            return <Switch disabled={readOnly} size='small'
                defaultValue={defaultValue} onChange={onChange} value={value} />;
        case 'numberField':
            return <InputNumber
                placeholder={placeholder}
                controls={false}
                defaultValue={defaultValue}
                variant={variant} readOnly={readOnly}
                size={size}
                value={value}
                style={{ width: "100%" }}
                onChange={onChange}
                addonAfter={iconElement(icon, null, tooltip)}
            />;
        case 'customDropdown':
            return <CustomDropdown
                variant={variant} value={value}
                defaultValue={defaultValue} options={typeof dropdownOptions === 'string' ?
                    getValueFromString(dropdownOptions) : dropdownOptions.map(option => ({ ...option, label: iconElement(option.label, option.value, tooltip) }))} readOnly={readOnly} onChange={onChange} size={size} customTooltip={props.customTooltip} />;
        case 'textArea':
            return <Input.TextArea
                rows={2}
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue}
                readOnly={readOnly} size={size} onChange={onChange} style={{ top: '4px' }} />;
        case 'codeEditor':
            return editor;
        case 'iconPicker':
            return <IconPickerWrapper iconSize={20} selectBtnSize={size} defaultValue={value} value={value} readOnly={readOnly} onChange={onChange} applicationContext={allData} />;
        case 'imageUploader':
            return <ImagePicker
                value={value}
                readOnly={readOnly}
                onChange={onChange}
            />;
        case 'button':
            return <Button disabled={readOnly} defaultValue={defaultValue} type={value ? 'primary' : 'default'} size='small' icon={!value ? iconElement(icon, null, tooltip) : iconElement(iconAlt, null, tooltip)} onClick={() => onChange(!value)} title={tooltip} />;
        case 'filtersList':
            return <FiltersList readOnly={readOnly}  {...props} />;
        case 'buttonGroupConfigurator':
            return <ButtonGroupConfigurator readOnly={readOnly} size={size} value={value} onChange={onChange} />;
        case 'editModeSelector':
            return <Radio.Group buttonStyle='solid' defaultValue={defaultValue} value={value} onChange={onChange} size={size} disabled={readOnly}>
                {editModes.map(({ value, icon, title }) => {
                    return <Radio.Button key={value} value={value}>{iconElement(icon, null, title)}</Radio.Button>;
                })}
            </Radio.Group>;
        case 'dynamicItemsConfigurator':
            return <DynamicActionsConfigurator editorConfig={{ ...props }} readOnly={readOnly} value={value} onChange={onChange} size={size} />;
        case 'autocomplete':
            return <Autocomplete
                dataSourceType={dataSourceType}
                dataSourceUrl={dataSourceUrl}
                readOnly={readOnly}
                value={value}
                placeholder={placeholder}
                defaultValue={defaultValue}
                size={size}
                {...{ ...props, style: {} }}
            />;
        case 'endpointsAutocomplete':
            return <EndpointsAutocomplete {...props} size={size} httpVerb={verb} value={value} onChange={onChange} />;
        case 'referenceListAutocomplete':
            return <ReferenceListAutocomplete value={value} onChange={onChange} readOnly={readOnly} size={size} />;
        case 'queryBuilder':
            return <QueryBuilderWrapper>
                <QueryBuilder {...{ ...props }} hideLabel={true}
                    defaultValue={defaultValue} readOnly={props.readOnly}></QueryBuilder>
            </QueryBuilderWrapper>;
        case 'columnsConfig':
            return <ColumnsConfig size={size} {...props} />;
        case 'columnsList':
            return <ColumnsList {...props} readOnly={readOnly} />;
        case 'sizableColumnsConfig':
            return <SizableColumnsList {...props} readOnly={readOnly} />;
        case 'editableTagGroupProps':
            return <EditableTagGroup value={value} defaultValue={defaultValue} onChange={onChange} readOnly={props.readOnly} />;
        case 'propertyAutocomplete':
            return <PropertyAutocomplete
                id={props.id}
                size={props.size}
                readOnly={props.readOnly}
                autoFillProps={props.autoFillProps ?? true}
                value={value}
                onChange={onChange}
            />;
        case 'contextPropertyAutocomplete':
            return <ContextPropertyAutocomplete {...{ ...props }} readOnly={readOnly} defaultModelType="defaultType" formData={formData} id="contextPropertyAutocomplete" />;
        case 'formAutocomplete':
            return <FormAutocomplete
                readOnly={readOnly}
                size={props.size}
                value={value}
                onChange={onChange}
            />;
        case 'labelValueEditor':
            return <LabelValueEditor {...props} exposedVariables={codeEditorProps.exposedVariables} />;
        case 'permissions':
            return <PermissionAutocomplete value={value} readOnly={readOnly} onChange={onChange} size={size} />;
        case 'multiColorPicker':
            return <MultiColorInput value={value} onChange={onChange} readOnly={readOnly} propertyName={propertyName} />;
        case 'itemListConfiguratorModal':
            return <ItemListConfiguratorModal<ITabPaneProps | IWizardStepProps>
                readOnly={readOnly}
                initNewItem={onAddNewItem}
                value={value}
                onChange={onChange}
                size={size}
                settingsMarkupFactory={() => {
                    return {
                        components: listItemSettingsMarkup,
                        formSettings: {
                            colon: false,
                            layout: 'vertical' as FormLayout,
                            labelCol: { span: 6 },
                            wrapperCol: { span: 18 }
                        }
                    };
                }}
                itemRenderer={({ item }) => ({
                    label: item.title || item.label || item.name,
                    description: item.tooltip,
                    ...item
                })}
                buttonText={readOnly ? props.buttonTextReadOnly : props.buttonText}
                modalSettings={
                    {
                        title: readOnly ? props.modalReadonlySettings.title : props.modalSettings.title,
                        header: <Alert message={readOnly ? props.modalReadonlySettings.header : props.modalSettings.header} />
                    }
                }
            >
            </ItemListConfiguratorModal>;
        case 'formTypeAutocomplete':
            return <AutoComplete
                disabled={readOnly}
                options={formTypesOptions}
                onSearch={(t) =>
                    setFormTypesOptions(
                        (t
                            ? formTypes.filter((f) => {
                                return f.toLowerCase().includes(t.toLowerCase());
                            })
                            : formTypes
                        ).map((i) => {
                            return { value: i };
                        })
                    )
                }
            />;
        case 'configurableActionConfigurator':
            return <ConfigurableActionConfigurator value={value} onChange={onChange} editorConfig={null} level={0} label={label} />;
        case 'typeAutoComplete':
            return <Autocomplete
                dataSourceType="url"
                dataSourceUrl="/api/services/app/Metadata/TypeAutocomplete"
                readOnly={readOnly}
                size={size}
                value={value}
                onChange={onChange}
            />;
        case 'componentSelector':
            return <FormComponentSelector
                componentType={componentType}
                noSelectionItem={
                    noSelectionItemText ? { label: noSelectionItemText, value: noSelectionItemValue } : undefined
                }
                readOnly={readOnly}
                size={size}
                value={value}
                onChange={onChange}
                propertyMeta={propertyMeta}
            />;
        case 'RefListItemSelectorSettingsModal':
            return <RefListItemSelectorSettingsModal {...props} onChange={onChange} referenceList={referenceList?._data} readOnly={false} />;
        default:
            return <Input
                size={size}
                onChange={(e) => onChange(e.target.value)}
                readOnly={readOnly}
                defaultValue={defaultValue}
                variant={variant}
                placeholder={placeholder}
                suffix={<span style={{ height: '20px' }}>{iconElement(icon, null, tooltip)}</span>}
                value={value?.value ? value.value : value}
            />;
    }
};


export interface IInputRowProps {
    inputs: Array<ISettingsInputProps>;
    readOnly: boolean;
    inline?: boolean;
    children?: React.ReactNode;
    hidden?: boolean;
}

