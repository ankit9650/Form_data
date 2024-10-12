import { ErrorMessage, Field } from 'formik'
import React from 'react'
import TextError from "./TextError"

const CustomInput = (props) => {
   const { label, name, ...rest } = props
   return (
      <div className="my-2">
         <label htmlFor={name} className="block text-xs font-medium text-gray-700"> {label} </label>
         <Field
            name={name}
            id={name}
            {...rest}
            className="mt-1 rounded-md border border-gray-200 shadow-sm sm:text-sm py-2"
         />
         <ErrorMessage name={name} component={TextError} /> 
      </div>
   )
}

export default CustomInput