import useSwrData from "@wanp/use-swr-data";

interface ObjParams { name: string; age: number; type: string; value: string }
async function object(data: ObjParams) {
  return new Promise<ObjParams>((resolve) => {
    setTimeout(() => {
      console.log("[ data ] ===>", data);
      resolve(data);
    }, 1000);
  });
}

function Demo() {
  const { data } = useSwrData({
    reqKey: "111",
    req: object,
    // paging: true,
  });

  console.log("[ data ] ===>", data?.age);

  return <div>useSwrData</div>;
}

export default Demo;
