import { useState } from 'react';

export const InputField = () => {
      const [inputValue, setInputValue] = useState('');

      const handleChange = (event: any) => {
        setInputValue(event.target.value);
      };
      
      return (
        <form>
          <label>
            Enter text:
            <input type="text" value={inputValue} onChange={handleChange} />
          </label>
          <p>Current input value: {inputValue}</p>
        </form>
      );
};