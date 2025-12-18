'use client'

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative glass-panel rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">ข้อกำหนดในการให้บริการ</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 text-sm text-gray-300">
          <section>
            <h3 className="text-base font-semibold text-white mb-2">1. การยอมรับข้อกำหนด</h3>
            <p className="text-gray-400">
              โดยการใช้งานบริการนี้ คุณยอมรับและตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขทั้งหมดที่ระบุไว้ในเอกสารนี้
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">2. การใช้งาน</h3>
            <p className="text-gray-400">
              คุณมีสิทธิ์ใช้งานบริการเพื่อจัดการและดูข้อมูล Facebook Groups ของคุณเท่านั้น 
              ห้ามใช้บริการเพื่อวัตถุประสงค์ที่ผิดกฎหมายหรือละเมิดสิทธิ์ของผู้อื่น
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">3. ความปลอดภัยของข้อมูล</h3>
            <p className="text-gray-400">
              เรามุ่งมั่นในการปกป้องข้อมูลส่วนบุคคลของคุณ ข้อมูลทั้งหมดจะถูกเก็บรักษาอย่างปลอดภัย 
              และจะไม่ถูกเปิดเผยให้กับบุคคลที่สามโดยไม่ได้รับอนุญาต
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">4. ความรับผิดชอบ</h3>
            <p className="text-gray-400">
              คุณต้องรับผิดชอบต่อการรักษาความปลอดภัยของบัญชีและรหัสผ่านของคุณ 
              หากมีการใช้งานบัญชีโดยไม่ได้รับอนุญาต คุณต้องแจ้งให้เราทราบทันที
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-2">5. การเปลี่ยนแปลงข้อกำหนด</h3>
            <p className="text-gray-400">
              เราขอสงวนสิทธิ์ในการแก้ไขข้อกำหนดและเงื่อนไขนี้ได้ตลอดเวลา 
              การเปลี่ยนแปลงจะมีผลทันทีหลังจากประกาศบนเว็บไซต์
            </p>
          </section>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all"
          >
            ปฏิเสธ
          </button>
          <button
            onClick={onAccept}
            className="flex-1 px-4 py-2 bg-white text-black hover:bg-gold rounded-xl font-medium transition-all"
          >
            ยอมรับ
          </button>
        </div>
      </div>
    </div>
  )
}

