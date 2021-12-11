import { css } from "@emotion/css"
import styled from "@emotion/styled"
import { InputTextArea, Button, InputText } from "../styled/InputText"

export const containerStyle = css`
  text-align: center;
`

export const Textarea = styled(InputTextArea)`
  width: 95%;
  border: 0.5px gainsboro solid;
`

export const Button_ = styled(Button)`
  width: 70%;
  height: 2.2em;
  margin-top: 3em;
`

export const FormItem = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 1.5em;
`

export const FormItemName = styled.p<{ big?: boolean }>`
  padding-right: 2em;
  text-align: right;
  width: ${props => props.big ? '10em' : '2em'};
  font-weight: bold;
`

export const ResultDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`

export const Text = styled(InputText) <{ error?: boolean }>`
  width: 95%;
  border: 0.5px gainsboro solid;
  border-color: ${props => props.error ? 'red' : undefined};
  border-width: ${props => props.error ? '2.2px' : undefined};
`