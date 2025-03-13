interface DeleteFormProps extends React.ComponentPropsWithoutRef<"form"> {
  afterSave: boolean;
  destructBtnLabel?: string;
  children: React.ReactNode;
}

export type { DeleteFormProps };
