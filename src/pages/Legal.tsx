import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './Legal.css'

type Section = { h: string; p: ReactNode[] }

const UPDATED = '18 October 2026'

const PAGES: Record<string, { title: string; intro: string; sections: Section[] }> = {
  returns: {
    title: 'Returns, refunds and warranty',
    intro:
      'We want you to be happy with your filter. This policy follows the Consumer Protection Act (CPA) and the Electronic Communications and Transactions Act (ECTA).',
    sections: [
      {
        h: 'Changed your mind? 7 day cooling off',
        p: [
          'You may cancel an online order within 7 days of receiving it, for any reason. The product must be unused and returned in its original packaging. You pay only the direct cost of sending it back, and we refund the rest within 30 days of receiving it.',
        ],
      },
      {
        h: 'Faulty products: 6 month warranty',
        p: [
          'If a product is defective or does not work as described within 6 months of delivery, you may choose a repair, a replacement or a refund. We cover the cost of collecting a faulty item.',
          'Filter cartridges are consumables. A cartridge that slows down or stops after normal use has reached the end of its life and is not a defect. Damage from incorrect installation, unusual water pressure or misuse is also not covered.',
        ],
      },
      {
        h: 'Wrong or damaged item',
        p: ['If something arrives damaged or is not what you ordered, email us within 7 days with a photo and your order reference and we will put it right at our cost.'],
      },
      {
        h: 'How to return something',
        p: [
          <>
            Email <a href="mailto:info@nerofylabs.com">info@nerofylabs.com</a> with your order reference (it starts with NL-) and the
            reason. We will reply with return instructions within one working day.
          </>,
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of sale',
    intro: 'These terms apply to every purchase made on nerofylabs.com.',
    sections: [
      {
        h: 'Who we are',
        p: [
          'Nerofy Labs (Pty) Ltd, registration number 2026/325187/07, a private company registered in South Africa and based in Johannesburg, Gauteng. Email: info@nerofylabs.com.',
        ],
      },
      {
        h: 'Prices and payment',
        p: [
          'All prices are in South African Rand. Nerofy Labs is not currently registered for VAT, so no VAT is added. Delivery is charged separately and shown before you pay.',
          'Payments are processed by PayFast. Your order is accepted once PayFast confirms payment. We never see or store your card details.',
        ],
      },
      {
        h: 'Stock',
        p: ['Stock levels on the site update automatically. If an item sells out after you have paid, we will offer you a replacement date or a full refund.'],
      },
      {
        h: 'Delivery',
        p: [
          'We deliver anywhere in South Africa using PUDO, either to a locker or to your door. Delivery times are estimates. Ownership and risk pass to you on delivery or collection.',
        ],
      },
      {
        h: 'Product information',
        p: [
          'Filters reduce the contaminants described on each product page. Performance depends on your water supply, pressure and cartridge age. Our products are not medical devices and make no medical claims.',
        ],
      },
      {
        h: 'Returns and warranty',
        p: [
          <>
            See our <Link to="/returns">returns and warranty policy</Link>. Nothing in these terms limits your rights under the Consumer
            Protection Act.
          </>,
        ],
      },
      { h: 'Law', p: ['These terms are governed by the laws of South Africa.'] },
    ],
  },
  privacy: {
    title: 'Privacy policy',
    intro:
      'Nerofy Labs (Pty) Ltd respects your privacy and processes personal information in line with the Protection of Personal Information Act (POPIA).',
    sections: [
      {
        h: 'What we collect',
        p: ['When you order or contact us: your name, email address, cell number, delivery address or chosen locker, and what you ordered. We do not collect or see card details.'],
      },
      {
        h: 'Why we use it',
        p: ['To process and deliver your order, send order and delivery updates, answer your questions, handle returns and warranty claims, and keep the records the law requires. We do not sell your information and we only send marketing if you ask for it.'],
      },
      {
        h: 'Who we share it with',
        p: ['Only the service providers needed to run the shop: PayFast (payments), PUDO and The Courier Guy (delivery), Netlify (website hosting) and Google (order records and email). Each is bound to protect your information.'],
      },
      {
        h: 'How long we keep it',
        p: ['Order records are kept for 5 years for tax purposes. Enquiries are deleted when no longer needed.'],
      },
      {
        h: 'Your rights',
        p: [
          <>
            You may ask to see, correct or delete your personal information, or object to how we use it, by emailing{' '}
            <a href="mailto:info@nerofylabs.com">info@nerofylabs.com</a>. If you are unhappy with our response you may complain to the
            Information Regulator at inforegulator.org.za.
          </>,
        ],
      },
      { h: 'Cookies', p: ['The site stores your cart in your browser so it is still there when you come back. We do not use advertising trackers.'] },
    ],
  },
}

export default function Legal({ page }: { page: keyof typeof PAGES }) {
  const doc = PAGES[page]
  return (
    <main>
      <section className="page-hero page-hero-sm dark">
        <div className="container">
          <h1 className="page-title">{doc.title}</h1>
          <p className="page-lead">{doc.intro}</p>
        </div>
      </section>
      <section className="section section-tight">
        <div className="container legal">
          {doc.sections.map((s) => (
            <div className="legal-block" key={s.h}>
              <h2>{s.h}</h2>
              {s.p.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          ))}
          <p className="legal-updated">Last updated {UPDATED}</p>
        </div>
      </section>
    </main>
  )
}
