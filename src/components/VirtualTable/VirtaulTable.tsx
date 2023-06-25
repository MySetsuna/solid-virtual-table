import { useLocation } from '@solidjs/router';
import { Accessor, Component, createEffect, createResource, createSignal, For, Index, onMount, Suspense, useTransition } from 'solid-js';
import { useUser } from '../../providers/User';
import styles from './VirtualTable.module.css'
const VirtualTable: Component = () => {
  const fieldMaps = {
    'name': (value: string | number | string[] | undefined,cb:()=>void) => <input value={value} onChange={ cb} />,
    'color':  (value: string | number | string[] | undefined,cb:()=>void)=><input type="color"  value={value} onChange={ cb} />,
    'img':  (value: string | number | string[] | undefined,cb:()=>void)=><input type='file'  value={value} onChange={ cb} />,
    'imgUrl': (value: string | undefined) => <img src={value} />
  };
  const allFieldKeys = Object.keys(fieldMaps);
  const [user] = useUser();
  const [userId,setUserId] = createSignal<number|undefined>(undefined)
  const [fields] = createResource(userId, fetchFields);
  const [rows,{mutate}] = createResource(userId, fetchRows);
  createEffect(() => {
    const userId = user()?.id
    if (typeof userId ==='number') {
      setUserId(userId)
    }
  })


  return (
    <div class={styles.table}>
      <Index each={rows()}>
        {(row,rowIndex) => {
          return (
            <div  class={styles.row}>
              <For each={fields()}>
            {(field, fieldIndex) => {
              const getElementFc = Reflect.get(fieldMaps, field)
                  const fieldValue = Reflect.get(row(), field === 'imgUrl' ? 'img' : field)
                  const onChange = (event) => {
                    mutate((rows) => {
                      return rows?.map((row,index) => {
                        if (index === rowIndex) {
                          return { ...row,[field]: event?.target.value }
                        }
                        return row
                      })
                    })
                  }
                  console.log('**********');
                  
              return (<>{getElementFc(fieldValue,onChange)}</>)
              }}
          </For>
            </div>
          )
        }}
      </Index>
      <div>{ <Index each={rows()}>
        {(row, rowIndex) => {
          console.log(8888);
          
          return (
            <div >
                {JSON.stringify(row())}
            </div>
          )
        }}
      </Index>}</div>
    </div>
  );
};
export default VirtualTable;

function fetchFields (userId: number) {
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      console.log(userId, '*******');
      resolve([
        'color',
        'name',
        'img',
        'imgUrl',
      ]);
    }, 1000);
  });
}

function fetchRows(userId: number) {
  return new Promise<object[]>((resolve) => {
    setTimeout(() => {
      console.log(userId, '*******');
      resolve([
        {
          'color':'color',
          'name':'name',
          'img':'',
          'imgUrl':'3',
        },{
          'color':'color',
          'name':'name',
          'img':'',
          'imgUrl':'3',
        }
      ]);
    }, 1000);
  });
}
