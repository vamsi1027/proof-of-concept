
import { Colors } from '@dr-one/utils'
import { useState } from 'react'
import styled from 'styled-components'
interface ICheckboxRolesProps{
  checked: boolean,
  name: string,
  email: string,
  roles: Array<string>,
  setRoles: (email: string, role:string) =>void
}
const Container = styled.div`

    margin: 0 auto;
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: ${Colors.HEADERCOLOR};
    height: 50px;
    margin-bottom: 2px;
    > input {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

`
const CheckboxRoles = ({checked, name, email, setRoles, roles}: ICheckboxRolesProps) => {
  const [isChecked, setIsChecked] = useState(checked)
  return (
    <Container>
    <input
      type="checkbox"
      checked={isChecked}
      onChange={({target}) => {
        setIsChecked(target.checked)
        setRoles(email, name);
      }}
    />
  </Container>
  )
}

export default CheckboxRoles
