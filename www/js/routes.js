angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider

	.state('tabsController.beranda', {
		url: '/beranda',
		views: {
			'tab1': {
				templateUrl: 'templates/beranda.html',
				controller: 'berandaCtrl'
			}
		}
	})

	.state('tabsController.keranjang', {
		url: '/keranjang',
		views: {
			'tab2': {
				templateUrl: 'templates/keranjang.html',
				controller: 'keranjangCtrl'
			}
		}
	})

	.state('tabsController.profil', {
		url: '/profil',
		views: {
			'tab3': {
				templateUrl: 'templates/profil.html',
				controller: 'profilCtrl'
			}
		}
	})

	.state('tabsController.transaksiSaya', {
		url: '/transaksi',
		views: {
			'tab4': {
				templateUrl: 'templates/transaksiSaya.html',
				controller: 'transaksiSayaCtrl'
			}
		}
	})

	.state('tabsController.riwayatTransaksiSelesai', {
		url: '/transaksiRiwayatSelesai',
		views: {
			'tab4': {
				templateUrl: 'templates/riwayatTransaksiSelesai.html',
				controller: 'riwayatTransaksiSelesaiCtrl'
			}
		}
	})

	.state('tabsController.riwayatTransaksiBatal', {
		url: '/transaksiRiwayatBatal',
		views: {
			'tab4': {
				templateUrl: 'templates/riwayatTransaksiBatal.html',
				controller: 'riwayatTransaksiBatalCtrl'
			}
		}
	})

	.state('tabsController', {
		url: '/tabController',
		templateUrl: 'templates/tabsController.html',
		abstract:true
	})

	.state('barangDaftar', {
		url: '/page-barang-daftar',
		templateUrl: 'templates/barangDaftarPage.html',
		controller: 'barangDaftarCtrl'
	})

	.state('masuk', {
		url: '/login',
		templateUrl: 'templates/masuk.html',
		controller: 'masukCtrl'
	})

	.state('daftar', {
		url: '/signup',
		templateUrl: 'templates/daftar.html',
		controller: 'daftarCtrl'
	})

	.state('formTransaksi', {
		url: '/fromTransaksi',
		templateUrl: 'templates/formTransaksi.html',
		controller: 'formTransaksiCtrl'
	})

	.state('formPengantaran', {
		url: '/formPengantaran',
		templateUrl: 'templates/formPengantaran.html',
        controller: 'formTransaksiCtrl' // formPengantaranCtrl
	})

    .state('formKonfirmasi', {
		url: '/formKonfirmasi',
		templateUrl: 'templates/formKonfirmasi.html',
		controller: 'formTransaksiCtrl' // formKonfirmasiCtrl
	})

	.state('editProfil', {
		url: '/editProfil',
		templateUrl: 'templates/editProfil.html',
		controller: 'editProfilCtrl'
	})

	.state('rincianTransaksi', {
		url: '/transaksiRincian',
		templateUrl: 'templates/rincianTransaksi.html',
		controller: 'rincianTransaksiCtrl'
	})

	.state('editEmail', {
		url: '/editEmail',
		templateUrl: 'templates/editEmail.html',
		controller: 'editEmailCtrl'
	})

	.state('rincianBarang', {
		url: '/barang_rincian',
		params: {
			idBarang: ""
		},
		templateUrl: 'templates/rincianBarang.html',
		controller: 'rincianBarangCtrl'
	})

	.state('modalInputKeranjang', {
		url: '/modalKeranjang',
		templateUrl: 'templates/modal/modalInputKeranjang.html',
		controller: 'rincianBrangCtrl'
	})

	.state('modalInputOrder', {
		url: '/modalOrder',
		templateUrl: 'templates/modal/modalInputOrder.html',
		controller: 'rincianBrangCtrl'
	})

	.state('modalKeranjang', {
		url: '/modalKeranjang',
		templateUrl: 'templates/modal/modalKeranjang.html',
		controller: 'keranjangCtrl'
	})

	//.state('cobaPage', {
	//	url: '/page7',
	//	templateUrl: 'templates/cobaPage.html',
	//	controller: 'cobaPageCtrl'
	//})

	$urlRouterProvider.otherwise('/tabController/beranda')
});
