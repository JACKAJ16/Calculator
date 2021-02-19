import React, { useState } from 'react';
// components
import Button from '../Button';
import Input from '../Input';
// style
import './style.scss';

const Calculator: React.FC = () => {
  const [accumulator, setAccumulator] = useState<string>('');
  const [currentValue, setCurrentValue] = useState<string>('');
  const [result, setResult] = useState<string>('');

  // Trigger if '=' sign has been clicked
  const [resultTrigger, setResultTrigger] = useState<boolean>(false);

  // Arrays of numbers and operators for mapping
  const numbers = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0'];
  const operators = ['/', '*', '-', '+'];

  // Evaluation function
  const evaluate = (input: string) => {
    const calculate = (a: number, operator: string, b: number): number => {
      switch (operator) {
        case functions.add:
          return a + b;
        case functions.sub:
          return a - b;
        case functions.div:
          return a / b;
        case functions.mlt:
          return a * b;
        default:
          return 0;
      }
    };

    const functions = {
      add: '+',
      sub: '-',
      div: '/',
      mlt: '*',
    };

    // Create array for order of operations
    const order = [
      [[functions.mlt], [functions.div]],
      [[functions.add], [functions.sub]],
    ];

    let newInput = input.replace(/[^0-9%^*\/()\-+.]/g, ''); // clean up unnecessary characters

    let output;

    for (let i = 0, n = order.length; i < n; i++) {
      // Regular Expression to look for operators between floating numbers or integers
      const re = new RegExp('(\\d+\\.?\\d*)([\\' + order[i].join('\\') + '])(\\d+\\.?\\d*)');
      re.lastIndex = 0; // take precautions and reset re starting pos

      // Loop while there is still calculation for level of precedence
      while (re.test(newInput)) {
        output = calculate(Number(RegExp.$1), RegExp.$2, Number(RegExp.$3));
        if (isNaN(output) || !isFinite(output)) return output; // exit early if not a number
        newInput = newInput.replace(re, String(output));
      }
    }

    return output;
  };

  // Handle numbers input
  const handleChange = (e: string) => {
    if (e === '.') {
      currentValue.slice(-1) === '.' || currentValue.indexOf('.') !== -1
        ? null
        : currentValue.length === 0
        ? setCurrentValue('0' + e)
        : currentValue.length > 0 && setCurrentValue(currentValue + e);
    } else if (e === '0') {
      currentValue !== '0' && setCurrentValue(currentValue + e);
    } else if (result.length > 0) {
      setCurrentValue(e);
      setAccumulator('');
      setResult('');
    } else if (resultTrigger) {
      setCurrentValue(e);
      setAccumulator('');
      setResultTrigger(false);
    } else {
      currentValue.length <= 16 && setCurrentValue(currentValue + e);
    }
  };

  // Handle operators
  const handleOperator = (operator: string) => {
    if (
      currentValue.length === 0 &&
      (operators.find((item) => item === accumulator.slice(-1)) || accumulator.slice(-1) === '.')
    ) {
      setAccumulator(accumulator.slice(0, -1) + operator);
      setCurrentValue('');
    } else if (accumulator.length === 0) {
      setAccumulator(currentValue + operator);
      setCurrentValue('');
    } else if (accumulator.length > 0) {
      resultTrigger && setResultTrigger(false);
      setAccumulator(accumulator + currentValue + operator);
      setCurrentValue('');
      result.length > 0 && setAccumulator(result + operator);
    }
    setResult('');
  };

  // Calculate percentage
  const handlePercentage = () => {
    // test if there is more than 1 operator to handle accumulator for evaluate function or just remove one operator
    const testOperatorsCount = accumulator.slice(0, accumulator.length - 1).match(/[*/+-]/)?.length;
    const percentage = testOperatorsCount
      ? ((Number(evaluate(accumulator.slice(0, accumulator.length - 1))) / 100) * Number(currentValue)).toString()
      : ((Number(accumulator.slice(0, accumulator.length - 1)) / 100) * Number(currentValue)).toString();
    accumulator.length > 0 && currentValue.length > 0 && setCurrentValue(percentage);
  };

  // Handle all clear click
  const handleClear = () => {
    setAccumulator('');
    setCurrentValue('');
    setResult('');
  };

  // Handle one symbol delete
  const handleDelete = () => {
    if (result.length > 0) {
      setAccumulator(result);
      setCurrentValue('');
      setResult('');
      setResultTrigger(true);
    } else {
      const input = accumulator + currentValue;
      input.length > 0 && setAccumulator(input.slice(0, input.length - 1));
      setCurrentValue('');
    }
  };

  // Handle result click
  const handleResult = () => {
    if (result.length > 0) {
      setCurrentValue('');
      setAccumulator(result);
      setResult('');
      setResultTrigger(true);
    } else if (accumulator.length === 0) {
      setResult(currentValue);
    } else {
      const res =
        evaluate(accumulator + currentValue) === undefined ||
        evaluate(accumulator + currentValue) === Infinity ||
        (operators.find((item) => item === accumulator.slice(-1)) && currentValue.length === 0)
          ? 'Error'
          : String(evaluate(accumulator + currentValue));
      setResult(res);
    }
  };

  return (
    <div className="calculator">
      <Input input={accumulator + currentValue} result={result} />
      <div className="buttons">
        <Button className="clear" value={'AC'} onClick={handleClear} />
        <Button className="delete" onClick={handleDelete} />
        <Button className="percent" value={'%'} onClick={handlePercentage} />
        {numbers.map((item) => (
          <Button
            className={item !== '.' ? `num-${item}` : 'dot'}
            key={item}
            value={item}
            onClick={() => handleChange(item)}
          />
        ))}
        {operators.map((item) => (
          <Button className="operator" key={item} value={item} onClick={() => handleOperator(item)} />
        ))}
        <Button className={'result'} key={'='} value={'='} onClick={handleResult} />
      </div>
    </div>
  );
};

export default Calculator;
