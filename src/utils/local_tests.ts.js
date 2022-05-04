// [...[{id: 5, title: 'Заморожен'}].filter(({id})=>id===0),...[{id: 5, title: 'Заморожен'}, {id: 6, title: 'Отморожен'}]]
console.log([...[{id: 0, title: 'Старьёвщик0'},{id: 55, title: 'Старьёвщик55'}].filter(({id})=>!!id),
    ...[{id: 5, title: 'Заморожен'}, {id: 6, title: 'Отморожен'}]])