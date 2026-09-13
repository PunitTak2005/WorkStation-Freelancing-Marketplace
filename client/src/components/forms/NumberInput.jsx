import React, { forwardRef } from 'react';
import { IndianRupee } from 'lucide-react';
import TextInput from './TextInput';

const NumberInput = forwardRef(function NumberInput(
  { prefix = <IndianRupee size={16} />, ...props },
  ref
) {
  return (
    <TextInput
      ref={ref}
      type="number"
      icon={prefix}
      {...props}
    />
  );
});

export default NumberInput;
