const fs = require('fs');
const bodyParser = require("body-parser")
const express = require("express");
const method_override = require("method-override")

const app = express();
const port = 8877;
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(method_override('_method'));

// path to our JSON file
const dataPath = './Details.json'

const getEmpData = () => {
    const jsonData = fs.readFileSync(dataPath)
    return JSON.parse(jsonData)
}
const saveEmpData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData)
}

//read data
app.get('/', (req, res) => {
    //    let data=res.sendFile('Table.html',{root:'.'})
    let data = fs.readFileSync('Table.html')
    let jsonData = fs.readFileSync(dataPath)
    let arr = JSON.parse(jsonData)
    let empList = []
    arr.map(val =>
        empList.push(val)
    )
    let body = ''
    empList.map(val =>
        body += `<tr><td>${val.id}</td><td>${val.fname}</td><td>${val.age}</td><td>${val.sal}</td>
        <td><form method="post" action="/${val.id}?_method=DELETE"><button type="submit" class="btn btn-danger m-3">Delete</button></form></td>
       <td> <form method="get" action="/${val.id}"><button type="submit" class="btn btn-warning m-3">Update</button></form></td></tr>`
    )
    res.send(`${data} ${body} 
           </tbody>
           </table>
           </body>
           </html>    
           `)
    res.end()
    // res.send(arr)
})

app.get('/submit-data', (req, res) => {
    res.sendFile('Form.html', { root: '.' })
})

//create data
app.post('/submit-data', (req, res) => {
    var existData = getEmpData()
    var userData = req.body
    existData.push(userData)
    console.log(existData);

    saveEmpData(existData);
    res.redirect('/');
    
})

//update data
app.get('/:id', (req, res) => {
    // res.sendFile('Form.html',{root:'.'})
    const { id } = req.params;
    const existData = getEmpData();
    const index = existData.findIndex(pt => pt.id == id);
    const update_data = existData[index];
    let data = `<html>
    <head>
    </head>
    <body>
        <h3>Add Details</h3>
        <form method="post" action="/${id}?_method=PUT">
      
            Id:<input type="text" name="id" placeholder="Enter Id" value="${index+1}"/><br/><br/>
            Name:   <input type="text" name="fname" placeholder="Enter Name" value="${update_data.fname}"/><br/><br/>
            Age: <input type="text" name="age" placeholder="Enter age" value="${update_data.age}"/> <br/><br/>
            Salary:<input type="text" name="sal" placeholder="Enter Salary" value="${update_data.sal}"/><br/><br/>
            <input type="submit" value ="submit"/>
        </form>
    </body>
    </html>`;
    res.write(data);
})
app.put('/:id', (req, res) => {
    const { id } = req.params;
    const existData = getEmpData();
    const index = existData.findIndex(pt => pt.id == id);
    existData.splice(index, 1)
    
    const empData = req.body
    existData.push(empData)
    saveEmpData(existData)
    res.redirect('/')
})

//delete data
app.delete('/:id', (req, res) => {
    const { id } = req.params;
    const existData = getEmpData();
    const index = existData.findIndex(pt => pt.id == id);
    existData.splice(index, 1);
    saveEmpData(existData);
    res.redirect('/');
})


app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Work on ${port}`)
})
