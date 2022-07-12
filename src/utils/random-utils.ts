export const randMinMax = ( min: number, max: number ): number => Math.floor(Math.random() * ( max - min + 1 )) + min

// минимальное значение по умолчанию = 1
export const randFloorMax = ( max: number, min = 1 ): number => randMinMax(min, max)

// возвращает рандомный элемент массива
export const randArrayValue = <T = string>( array: T[] ): T => array[randFloorMax(array.length - 1, 0)]

// возвращает массив из необходимого числа элементов needArraySize
// рандомных /НЕ ОДИНАКОВЫХ/ целых чисел (from 0 to realArraySize)
// к которому можно потом "замапится" для перемешивания значений искомого массива, например:
// randomDifferentIntegersArrayCreator(array.length)(from 1 to array.length).map(el=>array[el])
export const randomDifferentIntegersArrayCreator = ( realArraySize = 1 ) =>
    ( needArraySize = realArraySize ): number[] => {

        const justArray = ( a: number, b: number[] = [] ) => {
            while (a--) b[a] = a
            return b
        }
        let arrayOfNumbers = justArray(realArraySize),
            nextNumber, buffered, size = realArraySize

        while (size) {
            nextNumber = Math.floor(Math.random() * ( --size + 1 ))
            buffered = arrayOfNumbers[size]
            arrayOfNumbers[size] = arrayOfNumbers[nextNumber]
            arrayOfNumbers[nextNumber] = buffered
        }

        const needToSliced = Math.min(realArraySize, needArraySize)

        return arrayOfNumbers.slice(-needToSliced)
    }
