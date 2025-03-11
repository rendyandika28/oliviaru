<script setup lang="ts">
import ClassBannerImg from '~/assets/images/class.jpg'
</script>
<template>
  <section class="space-y-8 my-4">
    <div class="flex flex-row items-center gap-4">
      <p-button variant="link" class="text-base-black" size="xs" icon pill><pi-chevron-circle-left-24 /></p-button>
      <p-heading class="font-bold" element="h5">Kelas Nastar Karakter</p-heading>
      <p-divider class="border-2 w-10 border-base-black" />
    </div>

    <img :src="ClassBannerImg" alt="class-banner" class="h-72 w-full object-cover rounded" />

    <div class="flex flex-col gap-2">
      <p-heading transform="capitalize" weight="bold" element="h6">DESKRIPSI KELAS</p-heading>
      <hr class="border-2 border-base-black w-10" />
      <div class="text-sm mt-5">
        <h1>Kelas Nastar Karakter 🍍✨</h1>
        <p>Belajar membuat nastar unik dan menggemaskan dengan karakter-karakter lucu
          di <strong>Kelas Nastar Karakter</strong>! Di kelas ini, Anda akan diajarkan teknik membuat nastar dengan
          bentuk
          yang menarik, mulai dari dasar hingga dekorasi detail agar tampilan nastar semakin cantik dan
          profesional.<br /></p>
        <h2>📌 Apa yang akan Anda pelajari?</h2>
        <ul>
          <li>✅ Resep nastar lembut dan
            lumer di mulut</li>
          <li>✅ Teknik membentuk dan mencetak karakter dengan sempurna</li>
          <li>✅ Tips pewarnaan
            dan dekorasi agar nastar terlihat menarik</li>
          <li>✅ Cara memanggang yang tepat agar hasilnya matang merata
          </li>
        </ul>
        <h2>💡 Untuk siapa kelas ini?</h2>
        <ul>
          <li>✅ Pemula yang ingin belajar membuat nastar dari nol
          </li>
          <li>✅ Pelaku usaha kuliner yang ingin menambah variasi jualan</li>
          <li>✅ Siapa saja yang ingin
            menyalurkan kreativitas melalui baking</li>
        </ul>
        <p><strong>Gabung sekarang dan ciptakan nastar karakter
            yang unik dan menarik! 🎨🍪</strong></p>
      </div>
    </div>

    <div class="flex flex-col justify-center items-center gap-2">
      <p-heading transform="capitalize" weight="bold" element="h6">MATERI KELAS</p-heading>
      <hr class="border-2 border-base-black w-14" />

      <p-list-group class="mt-4 w-full ">
        <p-list-group-item element="link" href="/class/kelas-nastar-karakter/informasi-suhu-oven">
          <p-text>Informasi suhu oven</p-text>
        </p-list-group-item>
        <p-list-group-item element="link" href="/class/kelas-nastar-karakter/informasi-suhu-oven">
          <p-text>Informasi suhu oven</p-text>
        </p-list-group-item>
        <p-list-group-item element="link" href="/class/kelas-nastar-karakter/informasi-suhu-oven">
          <p-text>Informasi suhu oven</p-text>
        </p-list-group-item>
        <p-list-group-item element="link" href="/class/kelas-nastar-karakter/informasi-suhu-oven">
          <p-text>Informasi suhu oven</p-text>
        </p-list-group-item>
        <p-list-group-item element="link" href="/class/kelas-nastar-karakter/informasi-suhu-oven">
          <p-text>Informasi suhu oven</p-text>
        </p-list-group-item>
      </p-list-group>
    </div>
  </section>
</template>
<style lang="scss" scoped></style>
