import { Component, createEffect, createResource, createSignal, For } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { Dynamic } from 'solid-js/web';
import { useUser } from '../../providers/User';
import styles from './VirtualTable.module.css';

type Field ='id' |
  'color' |
  'name' |
  'img' |
  'imgUrl';

type Row = {
  id: number;
  color: string;
  name: string;
  img: string;
  imgUrl: string;
};

const VirtualTable: Component = () => {
    const fieldMaps = {
        name: (props:{value: string | number | string[] | undefined, onChange:(value:string)=>void}) => <input value={props.value} onInput={ (event) => props.onChange(event.target.value)} />,
        color: (props:{value: string | number | string[] | undefined, onChange:(value:string)=>void}) => <input type="color" value={props.value} onInput={ (event) => props.onChange(event.target.value)} />,
        img: (props: { value: string | number | string[] | undefined, onChange: (value: string) => void }) => {
            return <input type='file' accept="image/*" onInput={(event) => {
                const file = event.target.files?.[0];
                let url = '';
                if (file) {
                    if (window.URL !== undefined) {
                        url = window.URL.createObjectURL(file as Blob);
                    } else if (window.webkitURL !== undefined) {
                        url = window.webkitURL.createObjectURL(file as Blob);
                    }
                }
                props.onChange(url);
            }} />;
        },
        imgUrl: (props: { value: string | undefined, onChange: () => void }) => {
            return <img src={props.value} />;
        }
    };
    const [user] = useUser();
    const [userId, setUserId] = createSignal<number|undefined>(undefined);
    const [fields] = createResource(userId, fetchFields);
    const [rows] = createResource(userId, fetchRows);
    const [store, setStore] = createStore<{
    fields: Field[], rows:Row[]}>({ fields: [], rows: [] });
    createEffect(() => {
        const userId = user()?.id;
        if (typeof userId === 'number') {
            setUserId(userId);
        }
    });
    createEffect(() => {
        setStore('fields', produce((arr) => arr.push(...(fields() ?? []))));
    });

    createEffect(() => {
        setStore('rows', produce((arr) => arr.push(...(rows() ?? []))));
    });

    return (
        <div class={styles.table}>
            <For each={store.rows}>
                {(row, rowIndex) => {
                    return (
                        <div class={styles.row}>
                            <For each={store.fields}>
                                {(field) => {
                                    return <Dynamic component={Reflect.get(fieldMaps, field)} onChange={(value: string) => {
                                        if (field === 'img') {
                                            setStore('rows', (rowItem, index) => index === rowIndex(), 'imgUrl', () => value);
                                        }
                                        setStore('rows', (rowItem, index) => index === rowIndex(), field, () => value);
                                    }} value={Reflect.get(row, field)} />;
                                }}
                            </For>
                        </div>
                    );
                }}
            </For>
            <div>{ <For each={store.rows}>
                {(row) => {
                    return (
                        <div >
                            {JSON.stringify(row)}
                        </div>
                    );
                }}
            </For>}</div>
            <button onClick={() => {
                setStore('rows', (rows) => {
                    const [a, b] = rows;
                    return [b, a];
                });
            }}>转化</button>
        </div>
    );
};
export default VirtualTable;

function fetchRows (userId: number) {
    return new Promise<Row[]>((resolve) => {
        console.log(userId, '*******');
        resolve(new Array(100).fill(0).map((_, index) => ({
            id: index,
            color: 'color',
            name: 'name',
            img: '',
            imgUrl: '3'
        })));
    });
}

function fetchFields (userId: number) {
    return new Promise<Field[]>((resolve) => {
        console.log(userId, 'userId');
        resolve([
            'color',
            'name',
            'img',
            'imgUrl', 'color',
            'name',
            'img',
            'imgUrl', 'color',
            'name',
            'img',
            'imgUrl', 'color',
            'name',
            'img',
            'imgUrl', 'color',
            'name',
            'img',
            'imgUrl'
        ]);
    });
}
