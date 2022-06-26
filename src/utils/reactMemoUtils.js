export const propsAreEqual = (prevProps, nextProps) => {
	const prevValue = JSON.stringify(prevProps.form?.getState());
	const nextValue = JSON.stringify(nextProps.form?.getState());
	return prevValue === nextValue;
};

// type PropsAreEqualType<FormData = AnyObject> = (
//     prevProps: FormRenderProps<FormData>,
//     nextProps: FormRenderProps<FormData>,
// ) => boolean
//
// const propsAreEqual: PropsAreEqualType = ( prevProps, nextProps ) => {
//     const prevValue = JSON.stringify(prevProps.form?.getState());
//     const nextValue = JSON.stringify(nextProps.form?.getState());
//     return prevValue === nextValue;
// };
