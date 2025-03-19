interface DeleteFormProps extends React.ComponentPropsWithoutRef<"form"> {
  afterSave?: boolean;
  destructBtnLabel?: string;
  children?: React.ReactNode;
}

interface DeleteFormData {
  form_id: string;
}

export type { DeleteFormProps, DeleteFormData };
