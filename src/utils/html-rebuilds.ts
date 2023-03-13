// обернуть в тег <b>
export const boldWrapper = ( text: string ): string => `<b>${ text }</b>`

// удалить все HTML тэги из строки
export const removeAllHTMLTags = ( text?: string ): string | undefined =>
    text?.replace( /<.+?>/g, '' ).replace( /&nbsp;/ig, '' )
