import { IStyleType } from "@/index";

export const buttonTypes = [
    {
        label: 'Default',
        value: 'default',
    },
    {
        label: 'Primary',
        value: 'primary',
    },
    {
        label: 'Ghost',
        value: 'ghost',
    },
    {
        label: 'Dashed',
        value: 'dashed',
    },
    {
        label: 'Link',
        value: 'link',
    },
    {
        label: 'Text',
        value: 'text',
    }
];

export const defaultStyles = (prev): IStyleType => {
    return {
        background: { type: 'color' },
        font: { weight: '400', size: 14, type: 'Segoe UI', align: 'center' },
        border: {
            border: { all: { width: '1px', style: 'solid', color: '#d9d9d9' } },
            radius: { all: 8 },
            hideBorder: false,
            borderType: 'all',
        },
        stylingBox: '{"paddingLeft":"15","paddingBottom":"4","paddingTop":"4","paddingRight":"15"}',
        dimensions: { width: prev.block ? '100%' : 'auto', height: '32px', minHeight: '0px', maxHeight: 'auto', minWidth: '0px', maxWidth: 'auto' }
    };
};

