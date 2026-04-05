import { CustomHeader } from '@/components/CustomHeader'

function page() {
  return (
    <div className="px-6 py-12 md:px-16">
      <CustomHeader
        title="Fixtures"
        subtitle="View your upcoming and past matches"
      />

    </div>
  )
}

export default page