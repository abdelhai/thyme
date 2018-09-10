// @flow

import React, { Component } from 'react';

import addMinutes from 'date-fns/add_minutes';
import format from 'date-fns/format';

import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';

import './Rounding.css';

const roundingIcon = {
  none: 'dont',
  round: 'arrows alternate vertical',
  ceil: 'angle up',
  floor: 'angle down',
};

const roundingOptions = [
  { text: 'No rounding', value: 'none' },
  { text: 'Nearest', value: 'round' },
  { text: 'Up', value: 'ceil' },
  { text: 'Down', value: 'floor' },
];

const formatTime = (date: Date) => format(date, 'HH:mm');

function roundingExample(amount: number, type: rounding) {
  if (type === 'none' || amount === 0) {
    return 'results in no automatic rounding';
  }

  const startTime = new Date(2018, 0, 1, 8);

  const diffDown = amount % 2 === 1 ? Math.floor(amount / 2) : (amount / 2) - 1;
  const diffUp = amount % 2 === 1 ? Math.ceil(amount / 2) : (amount / 2) + 1;

  const diffDownTime = addMinutes(startTime, diffDown);
  const diffUpTime = addMinutes(startTime, diffUp);

  return `results in ${formatTime(diffDownTime)} → 08:05 and ${formatTime(diffUpTime)} → 08:05`;
}

type RoundingState = {
  startAmount: number,
  startRounding: rounding,
}

class Rounding extends Component<*, RoundingState> {
  state = {
    startAmount: 5,
    startRounding: 'ceil',
  };

  render() {
    const { startRounding, startAmount } = this.state;

    return (
      <Form className="Rounding">
        <Form.Field>
          <label>Start time rounding</label>
          <div className="Rounding-Container">
            <Dropdown
              placeholder="Select rounding for start time"
              floating
              labeled
              button
              className="icon"
              value={startRounding}
              icon={roundingIcon[startRounding]}
              onChange={(e, { value }) => this.setState({ startRounding: value })}
              options={roundingOptions}
            />
            <Dropdown
              search
              searchInput={{ type: 'number' }}
              selection
              allowAdditions
              additionLabel=""
              value={startAmount}
              onChange={(e, { value }) => this.setState({ startAmount: parseInt(value, 10) })}
              options={
                [5, 10, 15, 20, 30, 45, 60]
                  .map((amount: number) => ({ key: amount, text: `${amount} minutes`, value: amount }))
              }
              placeholder="Round to amount of minutes"
            />
            <div className="Rounding-Example">
              {roundingExample(startAmount, startRounding)}
            </div>
          </div>
        </Form.Field>
      </Form>
    );
  }
}

export default Rounding;
