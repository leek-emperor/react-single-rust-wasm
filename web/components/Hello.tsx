import { useEffect, useState } from 'react';
import init, { test, greet } from '../rwasm';
interface Props {
    msg: string;
}

export default function Hello(props: Props) {
    const { msg } = props;
    const [txt, setTxt] = useState('');
    useEffect(() => {
        (async () => {
            await init();
            setTxt(test(msg));
        })();
    }, []);

    return (
        <>
            <h1 style={{ color: 'pink' }}>{msg}</h1>
            <h1>Rust Get: {txt}</h1>
            <button onClick={() => greet()}>Greet</button>
        </>
    );
}
