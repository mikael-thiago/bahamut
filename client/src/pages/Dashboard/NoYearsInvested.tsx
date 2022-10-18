import { Button } from '@chakra-ui/react'
import React, { MouseEventHandler } from 'react'

type NoYearsInvestedProps = {
  onAddOperation: MouseEventHandler
}

export const NoYearsInvested = ({ onAddOperation }: NoYearsInvestedProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <span className='text-4xl font-bold'>Parece que você ainda não cadastrou nenhuma operação!</span>
      <span className='text-2xl font-semibold mb-3'>Comece já!</span>
      <Button onClick={onAddOperation} size="lg">Cadastrar operação</Button>
    </div>
  )
}