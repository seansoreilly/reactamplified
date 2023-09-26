/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type CalendarEventUpdateFormInputValues = {
    uuid?: string;
    hourlyBlocks?: string;
};
export declare type CalendarEventUpdateFormValidationValues = {
    uuid?: ValidationFunction<string>;
    hourlyBlocks?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CalendarEventUpdateFormOverridesProps = {
    CalendarEventUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    uuid?: PrimitiveOverrideProps<TextFieldProps>;
    hourlyBlocks?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CalendarEventUpdateFormProps = React.PropsWithChildren<{
    overrides?: CalendarEventUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    calendarEvent?: any;
    onSubmit?: (fields: CalendarEventUpdateFormInputValues) => CalendarEventUpdateFormInputValues;
    onSuccess?: (fields: CalendarEventUpdateFormInputValues) => void;
    onError?: (fields: CalendarEventUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CalendarEventUpdateFormInputValues) => CalendarEventUpdateFormInputValues;
    onValidate?: CalendarEventUpdateFormValidationValues;
} & React.CSSProperties>;
export default function CalendarEventUpdateForm(props: CalendarEventUpdateFormProps): React.ReactElement;
