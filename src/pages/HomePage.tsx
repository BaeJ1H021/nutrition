import { useState } from 'react';
import { getRecommendations } from '../apis/recommendAPI';
import { CustomButton } from '../components/atoms';

const HomePage = () => {
  const [age, setAge] = useState<number>(28);
  const [sex, setSex] = useState<'남성' | '여성' | '기타'>('남성');
  const [height, setHeight] = useState<number>(177);
  const [weight, setWeight] = useState<number>(72);
  const [schedule, setSchedule] = useState<string>('야근,야구'); // 문자열로 입력 후 split

  const onSubmit = async () => {
    const payload = {
      age,
      sex,
      height_cm: height,
      weight_kg: weight,
      schedule: schedule.split(',').map((s) => s.trim()),
    };

    try {
      const res = await getRecommendations(payload);
      console.log('추천 결과:', res);
      alert(JSON.stringify(res)); // 간단히 alert로 결과 보여주기
    } catch (err) {
      console.error(err);
      alert('API 호출 실패');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>영양제 추천 테스트</h2>
      <div>
        <label>
          나이:
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          성별:
          <select value={sex} onChange={(e) => setSex(e.target.value as any)}>
            <option value="남성">남성</option>
            <option value="여성">여성</option>
            <option value="기타">기타</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          키(cm):
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          몸무게(kg):
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          일정(쉼표 구분):
          <input
            type="text"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />
        </label>
      </div>

      <CustomButton onClick={onSubmit} style={{ marginTop: '1rem' }}>
        API 쏘기
      </CustomButton>
    </div>
  );
};

export default HomePage;
