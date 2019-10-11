function makeNotesArray() {
    return [
        {
            id: 1,
            date_modified: '2018-10-27',
            folder_id: 1,
            content: 'Content 1'
        },
        {
            id: 2,
            date_modified: '2019-1-18',
            folder_id: 2,
            content: 'Content 2'
        },
        {
            id: 3,
            date_modified: '2019-02-25',
            folder_id: 2,
            content: 'Content 3'
        },
        {
            id: 4,
            date_modified: '2018-11-20',
            folder_id: 3,
            content: 'Content 4'
        },
        {
            id: 5,
            date_modified: '2019-09-08',
            folder_id: 3,
            content: 'Content 5'
        },
        {
            id: 6,
            date_modified: '2019-03-04',
            folder_id: 3,
            content: 'Content 6'
        },
    ]
}

module.exports = {
    makeNotesArray
}