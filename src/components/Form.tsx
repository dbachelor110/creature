import { useState } from "react";
const Form = ({
  setSkin,
  setIncubating,

}: {
  setSkin: (skin: string) => any;
  setIncubating: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);

  const incubate = async () => {
    const formElement = document.getElementById("skinForm") as HTMLFormElement;
      if(!formElement) return
      let formData = new FormData(formElement);

      // 處理資料
      // 宣告字串
      let outPutStr = ``;
      for (var dataPair of formData.entries()) {
          outPutStr +=`${dataPair[1]}`;
      }
      // alert(outPutStr);
    setLoading(true);
    outPutStr ? await setSkin(outPutStr) : {};
    setLoading(false);
    setIncubating(false);
  }

  return (
    <div id="Form">
      <form id="skinForm">
        <div className="skinFormItem">
          <label htmlFor="v1">你喜歡</label>
          <br></br>
          <input title="skin" type="radio" name="v1" value="1" />獨處
          <input title="skin" type="radio" name="v1" value="2" />和他人相處
        </div>
        <div className="skinFormItem">
          <label htmlFor="v2">學習新事物時，你更喜歡</label>
          <br></br>
          <input title="skin" type="radio" name="v2" value="1" />了解概念和理論
          <input title="skin" type="radio" name="v2" value="2" />注重實際用途
        </div>
        <div className="skinFormItem">
          <label htmlFor="v3">當你在做決定時，你更重視</label>
          <br></br>
          <input title="skin" type="radio" name="v3" value="1" />邏輯與公平
          <input title="skin" type="radio" name="v3" value="2" />感情與和睦
        </div>
        <div className="skinFormItem">
          <label htmlFor="v4">你的生活方式更傾向於</label>
          <br></br>
          <input title="skin" type="radio" name="v4" value="1" />注重結果
          <input title="skin" type="radio" name="v4" value="2" />享受過程
        </div>
      </form>
      
      <button
        type="button"
        className="button"
        onClick={incubate}
      >
        {loading ? (
          <span>
            <i className="fas fa-spinner fa-spin"></i>Sending...
          </span>
        ) : (
          <span>
            <i className="far fa-paper-plane"></i>Send
          </span>
        )}
      </button>
    </div>
  );
};

export default Form;