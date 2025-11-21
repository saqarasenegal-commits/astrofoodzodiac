
import { Link } from "react-router-dom";

export default function AstrofoodPreview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-3xl w-full text-center space-y-10">

        {/* Logo circulaire */}
        <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-r from-orange-400 to-red-500 shadow-lg overflow-hidden flex items-center justify-center">
          <img
            src="/astrofood-preview.png"
            alt="Astrofood Logo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Titre & Slogan */}
        <h1 className="text-5xl font-bold tracking-tight" style={{ fontFamily: '"Pacifico", serif' }}>
          Astrofood
        </h1>
        <p className="text-lg italic text-gray-200">
          Nutrition Astrologique Personnalisée
        </p>

        {/* Description */}
        <p className="text-xl text-gray-300 leading-relaxed">
          Découvrez votre alimentation personnalisée selon votre profil astrologique unique.  
          Harmonisez votre énergie avec les astres pour un bien-être optimal.
        </p>

        {/* Bouton principal */}
        <Link
          to="/nutrition"
          className="inline-block bg-gradient-to-r from-orange-400 to-red-500 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
        >
          Voir Mon Profil Nutritionnel ✨
        </Link>

        {/* Cartes explicatives */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {[
            { icon: "♍", title: "Profil Astrologique", desc: "Analyse complète de vos signes solaire, lunaire et ascendant" },
            { icon: "🍽️", title: "Menu Personnalisé", desc: "Recommandations nutritionnelles adaptées à votre élément" },
            { icon: "🥤", title: "Boissons Énergétiques", desc: "Jus et smoothies pour équilibrer votre énergie cosmique" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white text-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
