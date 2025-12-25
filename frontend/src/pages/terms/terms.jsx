import React from 'react';
import { Link } from 'react-router-dom';
import styles from './terms.module.css';

export default function Terms() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1>Terms of Service</h1>
          <p className={styles.lead}>Last updated: December 2025</p>
        </header>

        <section className={styles.section}>
          <h2>1. القبول (أدخل بالرجل اليمنى)</h2>
          <p>
           باستعمالك لـ "أهديني"، راك تسيني بلي عاقل وموافق على واش كاين هنا. إذا ما عجبكش الحال، أغلق التيليفون وروح  قود، ما تكسر لناش راسنا.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. استعمال الخدمة (كون متربي)</h2>
          <p>
            ممنوع البول والتكفات: السيت هذا للناس النقيين، أي واحد يخلي ريحتو ولا يدير الفوضى يبلوكيوه الجيران (الأدمين).
          </p>
        </section>

        <section className={styles.section}>
          <h2>ممنوع التقرعج</h2>
          <p>
           أدخل أهدي وخرج، ما تبقاش تسقسي "هذا شكون؟" و "منين جاب الدراهم؟".
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. الملكية الفكرية (تاعنا وحدنا)</h2>
          <p>
           امل واش تشوف هنا (كتيبة، تصاور، زواق) تاع "أهديني". إذا سرقت كاش حاجة، ندعيوا عليك في صلاة الفجر وما تربحش.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. المسؤولية (ما دخلناش)</h2>
          <p>
            ذا صراتلك كاش حاجة، ولا طاحلك التيليفون في الماء وأنت تستعمل في "أهديني"، ما تجيش تطبطب عندنا. حنا خاطينا، نتا اللي حابس.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. الخصوصية (سرّك في بير)</h2>
          <p>
           معلوماتك عندنا في الأمان، ما نبيعوهم ما نمدوهم. بصح إذا جاو يسقسوا عليك الخطابة، هذيك حاجة وحدة أخرى.
          </p>
        </section>

          <section className={styles.section}>
          <h2>6. التغييرات (كيما نحبوا)</h2>
          <p>
          لقوانين هادو يتبدلو على حساب المورال. إذا نضنا غدوا بانتلنا، نقدرو نزيدو قانون
          </p>
        </section>

        <footer className={styles.footer}>
          <p>Questions? Contact us at <a href="mailto:chemsou@gmail.com">support@ahdini.local</a></p>
          <p>
            <Link to="../Register">Return</Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
