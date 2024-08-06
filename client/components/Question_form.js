import React from 'react'

import { MdCropOriginal, MdOndemandVideo, MdDragIndicator } from 'react-icons/md'
import { FormControl, MenuItem, Select, TextField } from '@mui/material'
import { Accordion, AccordionSummary, AccordionDetails, FormControlLabel, Radio, Typography, IconButton, Checkbox, Button, Switch } from '@mui/material';
import { BiCheckbox } from 'react-icons/bi'
import { MdShortText } from 'react-icons/md'
import { MdSubject } from 'react-icons/md'
import { MdMoreVert } from 'react-icons/md'
import { BsTrash } from 'react-icons/bs'
import { MdFilterNone } from 'react-icons/md'
import { IoAddCircleOutline, IoRemoveOutline } from 'react-icons/io5'
import { MdTextFields } from 'react-icons/md'
import { BsFileText } from 'react-icons/bs'
import { FcRightUp } from 'react-icons/fc'
import { MdClose } from 'react-icons/md'
import { useEffect, useState, useContext } from 'react';
import "./Question_form.css"
import "./Question_form_dark.css"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { actionTypes } from './reducer';
// import { type } from 'os';

import { useStateValue } from './StateProvider';
import Swal from 'sweetalert2';
import { IoAddCircle } from "react-icons/io5";
import { MdLaunch } from "react-icons/md";
import Drawer from '@mui/material/Drawer';
import { ThemeContext } from '../ThemeContext';
import { useNavigate } from 'react-router-dom';


function Question_form() {
    const { id } = useParams();
    const [{ doc_name, doc_desc }, dispatch] = useStateValue();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { isDarkMode } = useContext(ThemeContext);
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([
        {
            questionText: '1+1 เท่ากับเท่าไหร่?',
            questionType: 'radio',
            options: [
                { optionText: '1' },
                { optionText: '2' },
                { optionText: '3' },
                { optionText: '4' }
            ],
            answer: false,
            answerKey: "",
            points: 0,
            open: true,
            required: false
        }
    ])
    const [documentName, setDocName] = useState('ไม่ระบุชื่อ');
    const [documentDescription, setDocDesc] = useState('เพิ่มคำอธิบาย');
    const [testTime, setTestTime] = useState("15min"); // ตั้งค่าเริ่มต้น
    const [attemptsAllowed, setAttemptsAllowed] = useState(1); // ตั้งค่าเริ่มต้น

    const deleteForm = async () => {
        const result = await Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: "คุณต้องการลบแบบทดสอบนี้?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            try {
                // ส่งคำขอ DELETE ไปยัง API
                await axios.delete(`http://localhost:9000/delete_form/${id}`);
                Swal.fire(
                    'ลบแล้ว!',
                    'แบบทดสอบของคุณถูกลบแล้ว',
                    'success'
                );
                console.log(id)
                navigate('/'); // นำผู้ใช้ไปยังหน้าหลัก
            } catch (error) {
                console.error('เกิดข้อผิดพลาดในการลบ:', error);
                Swal.fire(
                    'เกิดข้อผิดพลาด!',
                    'ไม่สามารถลบแบบทดสอบได้',
                    'error'
                    
                );
               
            }
        }
    };



    useEffect(() => {
        async function data_adding() {
            var request = await axios.get(`http://localhost:9000/data/${id}`);
            var question_data = request.data.questions;
            console.log(question_data)
            var doc_name = request.data.document_name
            var doc_descip = request.data.doc_desc
            console.log(doc_name + ' ' + doc_descip)
            setDocName(doc_name)
            setDocDesc(doc_descip)
            setQuestions(question_data)
            dispatch({
                type: actionTypes.SET_DOC_NAME,
                doc_name: doc_name
            })

            dispatch({
                type: actionTypes.SET_DOC_DESC,
                doc_desc: doc_descip
            })

            dispatch({
                type: actionTypes.SET_QUESTIONs,
                questions: question_data
            })
        }

        data_adding()

    }, [])
        ;
    function changeQuestion(text, i) {
        var newQuestion = [...questions];
        newQuestion[i].questionText = text;
        setQuestions(newQuestion);
        console.log(newQuestion)
    }

    function changeOptionValue(text, i, j) {
        var optionsQuestion = [...questions];
        optionsQuestion[i].options[j].optionText = text;

        setQuestions(optionsQuestion);
        console.log(optionsQuestion);
    }

    function addQuestionType(i, type) {
        let qs = [...questions];
        console.log(type)
        qs[i].questionType = type;

        setQuestions(qs);
    }

    function removeOption(i, j) {
        var RemoveOptionQuestion = [...questions];
        if (RemoveOptionQuestion[i].options.length > 1) {
            RemoveOptionQuestion[i].options.splice(j, 1);
            setQuestions(RemoveOptionQuestion)
            console.log(i + "__" + j);
        }
    }

    function addOption(i) {
        var optionsOfQuestion = [...questions];
        if (optionsOfQuestion[i].options.length < 5) {
            optionsOfQuestion[i].options.push({ optionText: 'Option' + (optionsOfQuestion[i].options.length + 1) })
        } else {
            console.logg("Max 5 Options");
        }

        setQuestions(optionsOfQuestion)
    }

    function copyQuestion(i) {
        expandCloseAll()
        let qs = [...questions]
        let newQuestion = { ...qs[i] };
        let qsCopy = JSON.parse(JSON.stringify(qs));
        qsCopy.push(newQuestion);

        setQuestions(qsCopy)
    }

    function deleteQuestion(i) {
        let qs = [...questions];
        if (questions.length > 1) {
            qs.splice(i, 1);
        }
        setQuestions(qs)
    }

    function requiredQuestion(i) {
        var reqQuestion = [...questions];
        reqQuestion[i].required = !reqQuestion[i].required
        console.log(reqQuestion[i].required + " " + i);
        setQuestions(reqQuestion)
    }

    function addMoreQuestionField() {

        expandCloseAll();
        setQuestions([...questions,
        { questionText: "Question", questionType: "radio", options: [{ optionText: "option 1" }], open: true, required: false }
        ]);
    }

    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }
        var itemgg = [...questions];
        const itemF = reorder(
            itemgg,
            result.source.index,
            result.destination.index
        );
        setQuestions(itemF);
    }


    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    function expandCloseAll() {
        let qs = [...questions];
        for (let j = 0; j < qs.length; j++) {
            qs[j].open = false;
        }
        setQuestions(qs);
    }

    function handleExpand(i) {
        let qs = [...questions];
        for (let j = 0; j < qs.length; j++) {
            if (i === j) {
                qs[i].open = true;
            } else {
                qs[j].open = false;
            }
        }
        setQuestions(qs);
    }

    function setOptionAnswer(ans, qno) {
        var Questions = [...questions];
        Questions[qno].answerKey = ans;

        setQuestions(Questions)
        console.log(qno + " " + ans)
    }

    function setOptionPoints(points, qno) {
        var Questions = [...questions];

        Questions[qno].points = points;

        setQuestions(Questions)
        console.log(qno + " " + points)
    }

    function doneAnswer(i) {
        var answerOfQuestion = [...questions];

        answerOfQuestion[i].answer = !answerOfQuestion[i].answer;
        setQuestions(answerOfQuestion)
    }
    function addAnswer(i) {
        var answerOfQuestion = [...questions];

        answerOfQuestion[i].answer = !answerOfQuestion[i].answer;

        setQuestions(answerOfQuestion)
    }

    function commitToDB() {
        console.log(questions);
        dispatch({
            type: actionTypes.SET_QUESTIONS,
            questions: questions
        })

        axios.post(`http://localhost:9000/add_questions/${id}`, {
            'document_name': documentName,
            'doc_desc': documentDescription,
            'questions': questions,
        })
        Swal.fire({
            position: "center",
            icon: "success",
            title: "บันทึกสำเร็จ",
            showConfirmButton: false,
            timer: 1500
        });
    }


    function questionsUI(isDarkMode) {
        return questions.map((ques, i) => (
            <Draggable key={i} draggableId={i + 'id'} index={i}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`draggable ${isDarkMode ? 'dark' : 'light'}`} // ใช้คลาสที่กำหนด
                    >
                        <div>
                            <div style={{ marginBottom: '1em', marginTop: '1em' }}>

                                <Accordion expanded={questions[i].open} onChange={() => { handleExpand(i) }} className={questions[i].open ? 'add_border' : ""}>
                                    <AccordionSummary
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        elevation={1}
                                        className={`accordion-summary ${isDarkMode ? 'dark' : 'light'}`}
                                    >
                                        {!questions[i].open && (
                                            <div className={`saved_questions ${isDarkMode ? 'dark' : 'light'}`}>
                                                <MdDragIndicator className='dragIcon' style={{color: isDarkMode ? 'white' : '#A3A3A3'}} fontSize='small' />
                                                <br></br>
                                                <Typography className={`typography ${isDarkMode ? 'dark' : 'light'}`} style={{ fontSize: "15px", fontWeight: "400", letterSpacing: '.1px', lineHeight: '24px', paddingBottom: "8px" }}>
                                                    {i + 1}. {questions[i].questionText}
                                                </Typography>
                                                {ques.options.map((op, j) => (
                                                    <div key={j} style={{ display: 'flex' }}>
                                                        <FormControlLabel
                                                            style={{ marginLeft: '5px', marginBottom: '5px' }}
                                                            disabled
                                                            control={<input type={ques.questionType} style={{ marginRight: '3px' }} required={ques.type} />}
                                                            label={
                                                                <Typography style={{ fontFamily: 'Roboto, Arial, sans-serif', fontSize: '13px', fontWeight: '400', letterSpacing: '.2px', lineHeight: '20px', color: isDarkMode ? '#D3D3D3' : '#202124' }}>
                                                                    {ques.options[j].optionText}
                                                                </Typography>
                                                            }
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </AccordionSummary>
                                    {questions[i].open ? (

                                        <div className={`question_boxes ${isDarkMode ? 'dark' : 'light'}`}>
                                            {!questions[i].answer ? (
                                                <AccordionDetails className={`add_question ${isDarkMode ? 'dark' : 'light'}`}>
                                                    <div className="add_question_top">
                                                        <input type="text" className={`question ${isDarkMode ? 'dark' : 'light'}`} placeholder='คำถาม' value={ques.questionText} onChange={(e) => { changeQuestion(e.target.value, i) }}></input>
                                                        <MdCropOriginal className='uploadPic' style={{ color: isDarkMode ? "#D3D3D3" : "#5f6368" }} />
                                                        <Select
                                                            className={`select ${isDarkMode ? 'dark' : 'light'}`}
                                                            style={{ fontSize: '13px',width: 'fit-content' }}
                                                            required
                                                            MenuProps={{
                                                                PaperProps: {
                                                                    sx: {
                                                                        backgroundColor: isDarkMode ? '#494949' : '#fff', // พื้นหลังของเมนู
                                                                        color: isDarkMode ? '#fff' : '#000', // สีตัวอักษรของเมนู
                                                                    },
                                                                },
                                                            }}
                                                        >

                                                            <MenuItem id='text' className={`menuItem ${isDarkMode ? 'dark' : 'light'}`} value="Text" onClick={() => { addQuestionType(i, 'text') }}><MdSubject style={{ marginRight: '10px', color: isDarkMode ? "#A3A3A3" : "#70757a" }} />บรรยาย</MenuItem>
                                                            <MenuItem id='checkbox' className={`menuItem ${isDarkMode ? 'dark' : 'light'}`} value="Checkbox" onClick={() => { addQuestionType(i, 'checkbox') }}><Checkbox style={{ marginRight: '10px', color: isDarkMode ? "#A3A3A3" : "#70757a" }} checked />อัตนัยหลายคำตอบ</MenuItem>
                                                            <MenuItem id='radio' className={`menuItem ${isDarkMode ? 'dark' : 'light'}`} value="Radio" onClick={() => { addQuestionType(i, 'radio') }}><Radio style={{ marginRight: '10px', color: isDarkMode ? "#A3A3A3" : "#70757a" }} checked />อัตนัยคำตอบเดียว</MenuItem>
                                                        </Select>
                                                    </div>
                                                    {ques.options.map((op, j) => (
                                                        <div className='add_question_body' key={j}>
                                                            {
                                                                (ques.questionType !== 'text') ?
                                                                    <input type={ques.questionType} style={{ marginRight: '10px' }} /> :
                                                                    <MdShortText style={{ marginRight: '10px' }} />
                                                            }
                                                            <div>
                                                                <input type="text" className={`text_input ${isDarkMode ? 'dark' : 'light'}`} placeholder='option' value={ques.options[j].optionText} onChange={(e) => { changeOptionValue(e.target.value, i, j) }}></input>
                                                            </div>
                                                            <MdCropOriginal style={{ color: isDarkMode ? "#D3D3D3" : "#5f6368" }} />
                                                            <IconButton arial-label='delete'
                                                                sx={{
                                                                    color: isDarkMode ? 'white' : '#5f6368',
                                                                }} >
                                                                <MdClose onClick={() => { removeOption(i, j) }} />
                                                            </IconButton>
                                                        </div>
                                                    ))}
                                                    {ques.options.length < 5 ? (
                                                        <div className='add_question_body'>
                                                            <FormControlLabel disabled control={
                                                                (ques.questionType !== 'text') ?
                                                                    <input type={ques.questionType} color='primary' inputProps={{ 'aria-label': 'secondary checkbox' }} style={{ marginLeft: '10px', marginRight: '10px' }} disabled /> :
                                                                    <MdShortText style={{ marginRight: '10px' }} />
                                                            } label={
                                                                <div>
                                                                    <input type='text' className={`text_input ${isDarkMode ? 'dark' : 'light'}`} style={{ fontSize: '13px', width: '60px' }} placeholder='ตัวเลือก'></input>
                                                                    <Button size='small' onClick={() => { addOption(i) }} style={{ textTransform: 'none', color: '#4285f4', fontSize: '13px', fontWeight: '600' }}>เพิ่มตัวเลือกอื่น</Button>
                                                                </div>
                                                            } />
                                                        </div>
                                                    ) : ""}
                                                    <div className='add_footer'>
                                                        <div className='add_question_bottom_left'>
                                                            <Button size='small' style={{ textTransform: 'none', color: '#4285f4', fontSize: '13px', fontWeight: '600' }} onClick={() => { addAnswer(i) }}>
                                                                <FcRightUp style={{ border: `2px solid ${isDarkMode ? '#D3D3D3' : '#4285f4'}`, padding: "2px", marginRight: '8px' }} />
                                                                คำตอบ
                                                            </Button>
                                                        </div>

                                                        <div className='add_question_bottom'>
                                                            <div className='question_edit'>
                                                                <a className={`edit ${isDarkMode ? 'dark' : 'light'}`} onClick={addMoreQuestionField}>
                                                                    เพิ่มคำถาม <IoAddCircle />
                                                                </a>
                                                            </div>

                                                            <IconButton aria-label="Copy" onClick={() => { copyQuestion(i) }}
                                                                className={isDarkMode ? 'iconButtonDark' : 'iconButtonLight'}>
                                                                <MdFilterNone  className={isDarkMode ? 'iconButtonDark' : 'iconButtonLight'}/>
                                                            </IconButton>

                                                            <IconButton aria-label='Delete' onClick={() => { deleteQuestion(i) }}
                                                                className={isDarkMode ? 'iconButtonDark' : 'iconButtonLight'}>
                                                                <BsTrash  className={isDarkMode ? 'iconButtonDark' : 'iconButtonLight'}/>
                                                            </IconButton>

                                                            <IconButton
                                                                className={isDarkMode ? 'iconButtonDark' : 'iconButtonLight'}>
                                                                <MdMoreVert  className={isDarkMode ? 'iconButtonDark' : 'iconButtonLight'}/>
                                                            </IconButton>

                                                        </div>
                                                    </div>
                                                </AccordionDetails>) : (

                                                <AccordionDetails className={`add_question ${isDarkMode ? 'dark' : 'light'}`}>
                                                    <div className='top_header'>
                                                        เลือกคำตอบที่ถูกต้อง
                                                    </div>
                                                    <div>
                                                        <div className='add_question_top'>
                                                            <input type='text' className={`question ${isDarkMode ? 'dark' : 'light'}`} placeholder='Question' value={ques.questionText} disabled />
                                                            <input type='number' className={`points ${isDarkMode ? 'dark' : 'light'}`} min='0' step='1' placeholder='0' onChange={(e) => { setOptionPoints(e.target.value, i) }} />
                                                        </div>
                                                        {ques.options.map((op, j) => (
                                                            <div className='add_question_body' key={j} style={{ marginLeft: '8px', marginBottom: '10px', marginTop: '5px' }}>
                                                                <div key={j}>
                                                                    <div style={{ display: 'flex' }} className=''>
                                                                        <div className='form-check'>
                                                                            <label style={{ fontSize: '13px', color: isDarkMode ? '#D3D3D3' : '#202124' }} onClick={() => { setOptionAnswer(ques.options[j].optionText, i) }}>
                                                                                {(ques.questionType != 'text') ?
                                                                                    <input
                                                                                        type={ques.questionType}
                                                                                        name={ques.questionText}
                                                                                        value='option3'
                                                                                        className={`form-check-input ${isDarkMode ? 'dark' : 'light'}`}
                                                                                        required={ques.required}
                                                                                        style={{ marginRight: '10px', marginBottom: '10px', marginTop: '5px' }}
                                                                                    /> : <MdShortText style={{ marginRight: '10px' }} />}

                                                                                {ques.options[j].optionText}
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className='add_question_body'>
                                                            {/* <Button size='small' style={{ textTransform: 'none', color: '#4285f4', fontSize: '13px', fontWeight: '600' }}>
                                                                <BsFileText style={{ fontSize: '20px', marginRight: '8px' }} />Add Answer Feedback </Button> */}
                                                        </div>
                                                        <div className='add_question_bottom'>
                                                            <Button variant='outlined' color='primary' style={{ textTransform: 'none', color: '#4285f4', fontSize: '12px', marginTop: '12px', fontWeight: '600' }}
                                                                onClick={() => { doneAnswer(i) }}>เสร็จสิ้น</Button>
                                                        </div>
                                                    </div>

                                                </AccordionDetails>
                                            )}
                                            {!ques.answer ? (<div className='question_edit'>
                                                {/* <IoAddCircleOutline className='edit' onClick={addMoreQuestionField} /> */}
                                            </div>
                                            ) : " "}
                                        </div>

                                    ) : " "}
                                </Accordion>
                            </div>
                        </div>
                    </div>
                )}
            </Draggable>
        ))
    }



    return (
        <div>
            <div className={`question_form ${isDarkMode ? 'dark' : 'light'}`}>
                <br />
                <div className={`section ${isDarkMode ? 'dark' : 'light'}`}>
                    <div className='question_title_section'>
                        <div className={`question_form_top ${isDarkMode ? 'dark' : 'light'}`}>
                            <input
                                type='text'
                                className={`question_form_top_name ${isDarkMode ? 'dark' : 'light'}`}
                                value={documentName}
                                placeholder='ชื่อแบบทดสอบ'
                                onChange={(e) => { setDocName(e.target.value) }}
                            />
                            <div className="input-group">
                            <p className={`text ${isDarkMode ? 'dark' : 'light'}`}>
                                เวลาในการทำแบบทดสอบ:
                                <Select
                                    className={`select ${isDarkMode ? 'dark' : 'light'}`}
                                    style={{ fontSize: '13px', maxWidth: '10em' }}
                                    required
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: isDarkMode ? '#494949' : '#fff', // พื้นหลังของเมนู
                                                color: isDarkMode ? '#fff' : '#000', // สีตัวอักษรของเมนู
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem id='15min' className={`menuItem ${isDarkMode ? 'dark' : 'light'}`} value="15min">15 นาที</MenuItem>
                                    <MenuItem id='30min' className={`menuItem ${isDarkMode ? 'dark' : 'light'}`} value="30min">30 นาที</MenuItem>
                                    <MenuItem id='1hour' className={`menuItem ${isDarkMode ? 'dark' : 'light'}`} value="1hour">1 ชั่วโมง</MenuItem>
                                    <MenuItem id='2hours' className={`menuItem ${isDarkMode ? 'dark' : 'light'}`} value="2hours">2 ชั่วโมง</MenuItem>
                                    <MenuItem id='3hours' className={`menuItem ${isDarkMode ? 'dark' : 'light'}`} value="3hours">3 ชั่วโมง</MenuItem>
                                </Select>
                                <span className={`text ${isDarkMode ? 'dark' : 'light'}`}>
                                    &nbsp;&nbsp;&nbsp;&nbsp;จำนวนครั้งที่เข้าทำได้:</span>&nbsp;
                                <input
                                    type='number'
                                    defaultValue='1'
                                    min='1'
                                    className={`input-number ${isDarkMode ? 'dark' : 'light'}`}
                                    style={{ maxWidth: '3em' }}
                                />
                            </p>
                            </div>

                            <input type='text' className={`question_form_top_desc ${isDarkMode ? 'dark' : 'light'}`} placeholder='เพิ่มคำอธิบาย' value={documentDescription} onChange={(e) => { setDocDesc(e.target.value) }} />
                            <div className='question_button'>
                                <Button className='launch' size='sm'>ปล่อยแบบทดสอบ <MdLaunch /></Button>&nbsp;
                                <Button className='danger' size='sm' onClick={deleteForm}>ลบแบบทดสอบ  <BsTrash /></Button>

                            </div>
                        </div>

                    </div>


                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >

                                    {questionsUI(isDarkMode)}

                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <br></br>
                    {/* <div className='save_form'>
                        <Button variant='contained' color='primary' onClick={commitToDB} style={{ fontSize: '14px' }}>บันทึก</Button>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default Question_form;