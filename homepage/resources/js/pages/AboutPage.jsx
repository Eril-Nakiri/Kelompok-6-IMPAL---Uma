import Navbar from "../components/Navbar";

export default function AboutPage() {
    const members = [
        {
        name: "Yehezkiel Moreno Herdinata",
        nim: "103012400024",
        },
        {
        name: "Ditya Felix Eril Santoso",
        nim: "103012400049",
        },
        {
        name: "Zaidaan Diavar Putra. S",
        nim: "103012400073",
        },
        {
        name: "Bahari Usman Lubis",
        nim: "103012400097",
        },
    ];

    return (
        <>
        <Navbar />
        <div className="page">
            <div className="min-h-screen bg-gray-50 py-10 px-4">
                <div className="max-w-5xl mx-auto">

                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold">About Project</h1>
                    <h2 className="text-gray-600 mt-2">
                    Sistem Pencatatan dan Manajemen Turnamen
                    </h2>
                </div>

                {/* Group Info */}
                <div className="bg-white shadow-md rounded-2xl p-6 mb-8 text-center">
                    <h2 className="text-xl font-semibold">Kelompok 12 / Uma</h2>
                </div>

                {/* Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {members.map((member, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-2xl p-5 hover:shadow-lg transition"
                    >
                        <h3 className="text-lg font-semibold text-gray-800">
                        {member.name}
                        </h3>
                        <p className="text-gray-500 mt-1">
                        NIM: {member.nim}
                        </p>
                    </div>
                    ))}
                </div>

                </div>
            </div>
        </div>
        </>
    );
}
