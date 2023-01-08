import styled from '@emotion/styled';
import Collapsable from './components/collapsable';
import { MultiSelector } from './components/selector-v2';
import { useState } from 'react';


const items = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
  { value: 'c', label: 'C' },
  { value: 'd', label: 'D' },
  { value: 'e', label: 'E' },
];

const FakeElement = styled.div`
  position: relative;
  padding: 15px;
  border: 1px solid #ecf0f4;
  box-sizing: border-box;
  background-color: #fff;
`;


const App = () => {
  const [hideFakeElement, setHideFakeElement] = useState(false);

  return (
    <>
      <div>
        <input
          id='hideFakeElement'
          type='checkbox'
          checked={hideFakeElement}
          onChange={() => setHideFakeElement(!hideFakeElement)}
        />
        <label htmlFor='hideFakeElement'>Hide Fake Element</label>
      </div>

      <Collapsable
        title={'Click me'}
      >
        <MultiSelector
          TriggerComponent={(props: any) => (
            <button onClick={props.onClick}>
              Toggle
            </button>
          )}
          values={['a']}
          items={items}
          onChange={() => { }}
        />
      </Collapsable>

      {hideFakeElement && (
        <FakeElement>
          Relative Area
        </FakeElement>
      )}
    </>
  )
};

export default App
