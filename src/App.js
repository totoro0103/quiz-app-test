import React, { useState } from 'react'
import ReactPlayer from "react-player";
import {
  Radio, RadioGroup, Stack, Button, Text, Heading, Flex, Grid, Box,
  Alert,
  AlertIcon,
} from "@chakra-ui/react"

import QuizData from './quiz_data.json'


const App = () => {
  const [quiz, setQuiz] = useState(QuizData)
  const [isSubmit, setIsSubmit] = useState(false)

  const handleChangeAnswer = (_answerId, _questionId) => {
    const newQuiz = JSON.parse(JSON.stringify(quiz))
    const newListQuestionAnswer = newQuiz.questions_answers.map(q => {
      if (q.id === _questionId) {
        return { ...q, answer_id: parseInt(_answerId, 10) }
      }
      return q
    })
    setQuiz({ ...newQuiz, ...{ questions_answers: newListQuestionAnswer } })
  }

  const handleSubmit = () => {
    const newQuiz = JSON.parse(JSON.stringify(quiz)) // deep clone
    const isValidation = newQuiz.questions_answers.every(q => q.answer_id)
    // check empty answer
    if (!isValidation) {
      const newListQuestionAnswer = newQuiz.questions_answers.map(q => {
        if (!q.answer_id) {
          return { ...q, ...{ error: 'Please choose answer !' } }
        }
        return { ...q, ...{ error: null } }
      })
      return setQuiz({ ...newQuiz, ...{ questions_answers: newListQuestionAnswer } })
    }

    // check correct answer
    const newListQuestionAnswer = newQuiz.questions_answers.map(q => {
      const correctAnsObj = q.answers.find(a => a.is_true)
      if (parseInt(q.answer_id, 10) === correctAnsObj.id) {
        return ({ ...q, ...{ correct: 'yes', error: null } })
      }
      return ({ ...q, ...{ correct: 'no', error: null } })
    })
    setIsSubmit(true)
    // cal score
    const score = newListQuestionAnswer.filter(q => q.correct === 'yes')
    return setQuiz({ ...newQuiz, ...{ questions_answers: newListQuestionAnswer, score: score?.length } })
  }

  return (
    <Grid
      templateColumns={['0px 1fr 0px', '0px 1fr 0px', '0px 1fr 0px', '300px 1fr 300px']}
      templateRows="auto 1fr auto"
      h="100vh"
      mb={20}
    >
      <Box />
      <Box>
        <Flex direction="column" p={[4, 4, 0, 0]}>
          <Heading mb={4}>{quiz.title}</Heading>
          <Text mb={4} fontSize={18}>{quiz.description}</Text>
          <div style={{
            position: 'relative',
            paddingTop: '56.25%'
          }}>
            <ReactPlayer
              width="100%"
              height="100%"
              url={quiz.url}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          </div>

          {quiz.questions_answers?.map((data, index) => (
            <Stack mt={4} direction="column" key={data.id}>
              <Text fontSize={18} fontWeight="bold">{index + 1} . {data.text}</Text>
              <RadioGroup onChange={(answerId) => handleChangeAnswer(answerId, data.id)} value={data.answer_id}>
                <Stack direction="column">
                  {data.answers.map(answer => (
                    <Radio isDisabled={isSubmit} checked={false} key={answer.id} value={answer.id}>{answer.text}</Radio>
                  ))}
                  {isSubmit && data.correct && data.correct === 'yes' &&
                    <Alert status="success">
                      <AlertIcon />
                      {data.feedback_true}
                    </Alert>}
                  {isSubmit && data.correct && data.correct === 'no' &&
                    <Alert status="error">
                      <AlertIcon />
                      {data.feedback_false}
                    </Alert>}
                  {data.error && <Text Text fontSize={12} color="red.900">{data.error}</Text>}
                </Stack>
              </RadioGroup>
            </Stack>
          ))
          }
          <Alert mt={4} status="success" variant="subtle">
            <Text fontSize={20}> Your Score:  {quiz.score}</Text>
          </Alert>
          <Button mt={4} mb={10} disabled={isSubmit} onClick={handleSubmit}>SUBMIT</Button>
        </Flex >
      </Box>
      <Box />
    </Grid >
  );
}

export default App;
