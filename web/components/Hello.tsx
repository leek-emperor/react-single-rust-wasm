import { test, greet } from '../rwasm';
interface Props {
    msg: string;
}
export default function Hello(props: Props) {
    const { msg } = props;
    return (
        <>
            <h1 style={{ color: 'pink' }}>{msg}</h1>
            <h1>Rust Get: {test('this is js')}</h1>
            <button onClick={() => greet()}>Greet</button>
        </>
    );
}
