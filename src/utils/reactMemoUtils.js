export const propsAreEqualForm = (prevProps, nextProps) => {
    const prevValue = JSON.stringify(prevProps.form?.getState())
    const nextValue = JSON.stringify(nextProps.form?.getState())
    return prevValue === nextValue
};

export const valuesAreEqual = (prevProps, nextProps) => {
    const prevValue = JSON.stringify(prevProps)
    const nextValue = JSON.stringify(nextProps)
    return prevValue === nextValue
}

export const valuesAreEqualFormInput = (prevProps, nextProps) => {
    const prevValue = JSON.stringify({...prevProps, children: null, resetFieldBy: null})
    const nextValue = JSON.stringify({...nextProps, children: null, resetFieldBy: null})
    return prevValue === nextValue
}

export const valuesAreEqualPortalByHTML = (prevProps, nextProps) => {
    const prevValue = prevProps.getHTMLElementId
    const nextValue = nextProps.getHTMLElementId
    return prevValue === nextValue
}

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
