import React, { useState } from "react";
import { ScrollView, Text, ToastAndroid, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CheckBox from '@react-native-community/checkbox';
import { acceptSNKRequest } from "../../../services/auth/register";
import Components from "../../../components";
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from "../../../../tailwind.config";


const { theme } = resolveConfig(tailwindConfig)

interface TermsAndConditionInterface {
  navigation: any,
  route: any
}

const SyaratKetentuanScreen: React.FC<TermsAndConditionInterface> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { isRegister } = route.params;
  const [loading, setLoading] = React.useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false)

  const pressRegister = async () => {
    setLoading(true)
    try {
      await acceptSNKRequest()
      navigation.navigate("ListChat")

    } catch (error) {
      ToastAndroid.show("Gagal menyetujui syarat dan ketentuan !", ToastAndroid.SHORT)

    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={{ flex: 1, marginBottom: insets.bottom }}>
      <ScrollView className=" bg-white px-5 pb-5">
        <Text className="font-bold text-2xl mb-2 text-black">
          Syarat & Ketentuan NKRIPS
        </Text>
        <Text className="mb-2 text-black">
          Tanggal berlaku: 25 September 2025{"\n"}
          Produk: Aplikasi/Platform NKRIPS{"\n"}
          Pengelola: PT HSEO Grha Tekno{"\n"}
          Alamat: Jl. Sunter Kemayoran No. 45A, Sunter Jaya, Tanjung Priok, Jakarta Utara 14350{"\n"}
          Email dukungan: support@nkrips.com{"\n"}
          Catatan: Ini S&K ringkas untuk tahap beta/testing komunitas terbatas. Layanan masih berubah, mungkin mengandung bug, downtime, dan kehilangan data. Jangan memakai untuk kebutuhan kritikal. Dengan memakai NKRIPS, Anda menyetujui ketentuan ini.
        </Text>

        <Text className="font-bold text-lg mt-4 text-black">1) Status Beta & Ruang Lingkup</Text>
        <Text className="mb-2 text-black">
          Fitur yang tersedia saat ini saja:{"\n"}
          • Feed (teks/foto/video; komentar, suka, bagikan){"\n"}
          • Chat (teks, gambar, suara){"\n"}
          • Video call (kualitas bergantung jaringan/perangkat){"\n"}
          • Marketplace lokal{"\n"}
          • Moderasi & pelaporan{"\n"}
          • Pendaftaran JADAB + Pengajuan Investasi (JADAB){"\n"}
          Fitur di luar daftar di atas belum aktif.
        </Text>

        <Text className="font-bold text-lg mt-4 text-black">2) Kelayakan & Pendaftaran</Text>
        <Text className="mb-2 text-black">
          • Usia minimum 13 tahun. Untuk menjadi penjual Marketplace atau mengajukan investasi JADAB: ≥ 18 tahun.{"\n"}
          • Data dasar dapat diminta (nama, telp/email, foto, identitas; dan data usaha bila relevan).{"\n"}
          • Pendaftaran/keanggotaan JADAB diputuskan oleh JADAB. Pengelola dapat meneruskan data ke JADAB sesuai Kebijakan Privasi.
        </Text>

        <Text className="font-bold text-lg mt-4 text-black">3) Perilaku Pengguna (Inti)</Text>
        <Text className="mb-2 text-black">
          Dilarang konten/aksi: pornografi, eksploitasi anak, kekerasan ekstrem, kebencian/SARA, terorisme, penipuan/hoaks, doxing, perundungan, spam/malware, pelanggaran HKI, jual-beli barang terlarang. Pelanggaran → peringatan, pembatasan, suspend, atau tutup akun.
        </Text>

        <Text className="font-bold text-lg mt-4 text-black">4) Konten & Moderasi Singkat</Text>
        <Text className="mb-2 text-black">
          • Hak milik konten tetap pada Anda. Dengan mengunggah, Anda memberi lisensi non eksklusif kepada Pengelola untuk menyimpan/menayangkan/menyesuaikan demi operasional Platform.{"\n"}
          • Konten dapat dihapus/disembunyikan bila melanggar S&K/hukum. Salinan cadangan dapat tersisa untuk jangka wajar atau bila diwajibkan hukum.
        </Text>

        <Text className="font-bold text-lg mt-4 text-black">5) Privasi</Text>
        <Text className="mb-2 text-black">
          • Pengelola memproses data sesuai Kebijakan Privasi dan hukum (UU PDP, dsb.).{"\n"}
          • Data dipakai untuk operasional, peningkatan layanan, keamanan, moderasi, dukungan, serta evaluasi beta (termasuk telemetri penggunaan).{"\n"}
          • Untuk pendaftaran/pengajuan via JADAB, data terkait dapat dibagikan ke JADAB/mitra evaluasi.{"\n"}
          • Hak subjek data (akses/perbaikan/penghapusan) tersedia sesuai hukum.
        </Text>

        <Text className="font-bold text-lg mt-4 text-black">6) Marketplace</Text>
        <Text className="mb-2 text-black">
          • Platform hanya mempertemukan penjual—pembeli. Pembayaran belum terintegrasi/escrow belum aktif → transaksi dilakukan mandiri oleh para pihak.{"\n"}
          • Wajib due diligence sendiri. Risiko transaksi berada pada para pihak. Dilarang barang/jasa ilegal/terbatas.{"\n"}
          • Kebijakan retur/refund ditentukan penjual; Pengelola dapat memfasilitasi mediasi ringan.
        </Text>

        <Text className="font-bold text-lg mt-4 text-black">7) JADAB & Pengajuan Investasi</Text>
        <Text className="mb-2 text-black">
          • Kanal untuk mengirim proposal usaha/proyek kepada JADAB/mitra.{"\n"}
          • Bukan penawaran efek kepada publik dan bukan layanan perantara keuangan berizin; tidak ada jaminan pendanaan/imbal hasil.{"\n"}
          • JADAB/mitra berhak uji tuntas, minta data tambahan, menolak/menyetujui sebagian/seluruh proposal.
        </Text>

        <Text className="font-bold text-lg mt-4 text-black">8) Keamanan & Larangan Teknis</Text>
        <Text className="mb-2 text-black">
          Jangan mengeksploitasi celah, melakukan scraping berlebihan, reverse engineering, penyebaran malware, atau otomatisasi tak sah. Laporkan kerentanan via email dukungan.
        </Text>

        <Text className="font-bold text-lg mt-4 text-black">9) Penafian & Batasan Tanggung Jawab</Text>
        <Text className="mb-2 text-black">
          Layanan disediakan “apa adanya” selama beta; mungkin ada bug/downtime/kehilangan data. Sepanjang diizinkan hukum, Pengelola tidak bertanggung jawab atas kerugian tidak langsung/konsekuensial. Tanggung jawab total (jika ada) paling besar Rp10.000.000 atau biaya yang Anda bayar dalam 3 bulan terakhir (mana yang lebih kecil).
        </Text>

        <Text className="font-bold text-lg mt-4 text-black">10) Penghentian & Perubahan</Text>
        <Text className="mb-2 text-black">
          Pengelola dapat membatasi/menutup akses jika melanggar S&K/hukum/keamanan. Anda bisa berhenti memakai dan meminta penghapusan akun sesuai prosedur. S&K beta dapat berubah; kami akan memberi pemberitahuan wajar di aplikasi.
        </Text>

        <Text className="font-bold text-lg mt-4 text-black">11) Hukum & Kontak</Text>
        <Text className="mb-2 text-black">
          Diatur oleh hukum Republik Indonesia. Sengketa: musyawarah → mediasi → (bila perlu) arbitrase BANI Jakarta atau PN Jakarta Utara.{"\n"}
          Kontak: support@nkrips.com{"\n"}
          Dengan menggunakan NKRIPS pada tahap beta ini, Anda menyatakan setuju atas S&K ringkas ini.
        </Text>
      </ScrollView>

      {
        isRegister &&
        <View className="py-3 border-t border-t-gray-100 px-4">
          <View className="items-center flex-row">
            <View className="w-1/12">
              <CheckBox
                boxType="square"
                tintColors={{ true: theme?.colors!.primary as string }}
                disabled={false}
                value={toggleCheckBox}
                onValueChange={(newValue) => setToggleCheckBox(newValue)}
              />
            </View>
            <View className="w-11/12 pl-2">
              <Text className="font-satoshi text-md text-black">Saya telah membaca dan menyetujui Syarat & Ketentuan diatas</Text>
            </View>
          </View>
          <View className="mt-3">
            <Components.Button
              isDisabled={toggleCheckBox ? false : true}
              label="Daftar"
              onPress={pressRegister}
              loading={loading}
            />
          </View>
        </View>
      }
    </View>
  );
};
export default SyaratKetentuanScreen;