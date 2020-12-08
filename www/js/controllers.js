angular.module('app.controllers', ["ionic", "ion-datetime-picker", "ngCordova", "angular-md5", "ngMap"]) // 'angular-datepicker'

.controller('berandaCtrl', function ($scope, $state, action, service, $rootScope, $ionicPickerI18n, $localStorage) {
	$ionicPickerI18n.weekdays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
	$ionicPickerI18n.months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
	$ionicPickerI18n.ok = "OK";
	$ionicPickerI18n.cancel = "Batal";
	$ionicPickerI18n.okClass = "button-positive";
	$ionicPickerI18n.cancelClass = "button-stable";
	$ionicPickerI18n.arrowButtonClass = "button-positive";

	$scope.$on("$ionicView.loaded", function () {
		//action.getInitHome().then(
		//	function successCallback(response) {
		//		if (response.data.message != null) {
		//			// console.log(response.data.barangAll);
		//			$rootScope.logo = response.data.konfigurasi.logo;
		//			$rootScope.barangAll = response.data.barangAll;
		//		} else {
		//			// console.log(response.data);
		//			// action.showAlert('Maaf', response.data.error);
		//			$rootScope.logo = response.data.konfigurasi.logo;
		//			$rootScope.barangAll = response.data.barangAll;
		//		}
		//	},
		//	function errorCallback(response) {
		//		$rootScope.logo = 'assets/img/no_image.png';
		//		// console.log(response.data);
		//		// action.showAlert('Maaf', response.data.error);
		//	}
		//);
	});

	$scope.setDateRent = function (tglAwal, tglAkhir) {
		$rootScope.tglAwal = tglAwal;
		$rootScope.tglAkhir = tglAkhir;
		$rootScope.jumlahHariSewa = Math.ceil(Math.abs(tglAwal.getTime() - tglAkhir.getTime()) / (1000 * 3600 * 24));
		$state.go('barangDaftar');
	}

	//service.sendData().then(
	//	function successCallback(response) {
	//		console.log(response);
	//	},
	//	function errorCallback(response) {
	//		console.log(response);
	//	}
	//);
})
.controller('barangDaftarCtrl', function ($scope, $state, action, $rootScope, $ionicHistory) {
	$scope.myGoBack = function () {
		$ionicHistory.goBack();
    };

	$scope.$on("$ionicView.loaded", function () {
		action.getInitHome().then(
			function successCallback(response) {
				if (response.data.message != null) {
					// console.log(response.data.barangAll);
					$rootScope.logo = response.data.konfigurasi.logo;
					$rootScope.barangAll = response.data.barangAll;
                    console.log($rootScope.barangAll);
				} else {
					// console.log(response.data);
					// action.showAlert('Maaf', response.data.error);
					$rootScope.logo = response.data.konfigurasi.logo;
					$rootScope.barangAll = response.data.barangAll;
				}
			},
			function errorCallback(response) {
				$rootScope.logo = 'assets/img/no_image.png';
				// console.log(response.data);
				// action.showAlert('Maaf', response.data.error);
			}
		);

    });


	$scope.searchItemAll = function (keyword) {
		action.searchBarangAll(keyword).then(
			function successCallback(response) {
				if (response.data.message) {
					// console.log(response.data.barangAll);
					$rootScope.barangAll = response.data.barangAll;
					// action.showAlert('Sukses', response.data.message);
					// $state.go('informasiSiswa');
				} else {
					action.showAlert('Maaf', response.data.error);
				}
			},
			function errorCallback(response) {
				// $rootScope.barang = {};
				// console.log(response);
				action.showAlert('Maaf', response.data.error);
			}
		);
	};

	$scope.rincianBarang = function (barang) {
		action.getBarangById(barang.id_barang).then(
			function successCallback(response) {
				if (response.data.success) {
					$rootScope.barang = response.data.barang;
					$rootScope.barangFotoByIdAll = response.data.barangFotoByIdAll;
					$state.go('rincianBarang');
				} else {
					action.showAlert('Maaf', response.data.error);
				}
			},
			function errorCallback(response) {
				$rootScope.barang = {};
				action.showAlert('Maaf', "Mohon periksa koneksi anda! " + response.data.error);
			}
		);
	};

})
.controller('keranjangCtrl', function ($scope, $state, action, service, $rootScope, $localStorage, $ionicModal, $ionicHistory) {
    $rootScope.itemsToTransaction = {};
    $scope.myGoBack = function () {
        $ionicHistory.goBack();
    };

    $scope.$on("$ionicView.loaded", function () {
        $rootScope.itemsToTransaction = [];
		$rootScope.reloadRead();
	});

	//$scope.item = {
	//	id_barang: parseInt($scope.barang.id_barang),
	//	stok_barang: parseInt($scope.barang.stok),
	//	harga_sewa: parseInt($scope.barang.harga_sewa),
	//	jumlah_barang: 1,
	//	tgl_sewa_awal: $rootScope.tglAwal,
	//	tgl_sewa_akhir: $rootScope.tglAkhir,
	//	jumlah_hari: $rootScope.jumlahHariSewa,
	//	total_harga: $rootScope.jumlahHariSewa * 1 * $scope.barang.harga_sewa
    //};

	$scope.modalKeranjangState = false;

    $scope.reArrangeCart = function (operator, keranjang) {
        if (operator === '+') {
            $rootScope.itemsToTransaction.push(keranjang);
        } else if (operator === '-') {
            $rootScope.itemsToTransaction.splice($rootScope.itemsToTransaction.indexOf(keranjang), 1);
        }
    };

    $scope.cartChoseChange = function (keranjang) {
        if (keranjang.checked === true) {
            $scope.reArrangeCart('+', keranjang);
        } else if (keranjang.checked === false) {
            $scope.reArrangeCart('-', keranjang);
        }
    };

    $scope.keranjangDetail = function (keranjang) {
        $scope.keranjang = keranjang;
        $scope.openModalKeranjang();
    };

    $scope.removeFromKeranjang = function () {
        if (!$rootScope.itemsToTransaction.length) {
            action.showAlert('Peringatan!', 'Mohon pilih Barang dalam keranjang anda terlebih dahulu.');
        } else {
            action.showConfirm($scope, 'Konfirmasi..!', 'Apakah anda yakin ingin menghapus item dari keranjang..?').then(
                function successCallback(confirmResponse) {
                    if (confirmResponse === true) {
                        service.removeItemFromCart($rootScope.itemsToTransaction, $localStorage.login_customer.id_pelanggan).then(
                            function successCallback(response) {
                                if (response.data.success) {
                                    $rootScope.reloadRead();
                                    action.showAlert('Sukses', response.data.success);
                                } else if (response.data.error && response.data.warning) {
                                    action.showAlert('Proses Gagal!', response.data.error);
                                } else {
                                    action.showAlert('Proses Gagal!', response.data.error);
                                }
                            }, function errorCallback(response) {
                                action.showAlert('Proses Gagal!', 'Mohon periksa koneksi anda!');
                            }
                        );
                    }
                }, function errorCallback(response) {
                    //
                }
            );
        }
    };

    $scope.checkoutFromKeranjang = function () {
        if (!$rootScope.itemsToTransaction.length) {
            action.showAlert('Peringatan!', 'Mohon pilih Barang dalam keranjang anda terlebih dahulu.');
        } else {
            action.showConfirm($scope, 'Konfirmasi..!', 'Apakah anda yakin isian sudah benar..?').then(
                function successCallback(confirmResponse) {
                    if (confirmResponse === true) {
                        //action.checkItemAvailable(item).then(
                        //    function successCallback(response) {
                        //        if (response.data.available === true) {
                        //            //action.showAlert('Sukses', response.data.message);
                        //            item.available = true;
                        //        } else {
                        //            item.available = false;
                        //            action.showAlert('Info', (response.data.message) ? response.data.message : 'Item tidak tersedia untuk rentang tanggal yang anda pilih!');
                        //        }
                        //        if ($scope.item.available == true) {
                                    //$rootScope.itemsToTransaction.push(angular.copy($scope.item));
                                    //$scope.closeModalOrder();
                                    $state.go('formTransaksi');
                        //        }
                        //    }, function errorCallback(response) {
                        //        action.showAlert('Proses Gagal!', 'Mohon periksa koneksi anda!');
                        //    }
                        //);
                    }
                }, function errorCallback(response) {
                    //
                }
            );
        }
        //service.addItemToTransaction($rootScope.itemsToTransaction, $localStorage.login_customer.id_pelanggan).then(function () {
        //    if (response.data.success) {
        //        $rootScope.reloadRead();
        //        action.showAlert('Sukses', response.data.success);
        //    } else if (response.data.error && response.data.warning) {
        //        action.showAlert('Proses Gagal!', response.data.error);
        //    } else {
        //        action.showAlert('Proses Gagal!', response.data.error);
        //    }
        //}, function () {
        //    action.showAlert('Proses Gagal!', 'Mohon periksa koneksi anda!');
        //});
    };

	$ionicModal.fromTemplateUrl('templates/modal/modalKeranjang.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.modalKeranjang = modal;
	});

	$scope.openModalKeranjang = function () {
		$scope.modalKeranjang.show();
		$scope.modalKeranjangState = true;
	};
	$scope.closeModalKeranjang = function () {
		angular.element(document.querySelector('body')).removeClass('modal-open');
		$scope.modalKeranjang.hide();
		$scope.modalKeranjangState = false;
	};
	// Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function () {
		$scope.modalKeranjang.remove();
	});
	// Execute action on hide modal
	$scope.$on('modalKeranjang.hidden', function () {
		$scope.modalKeranjang.hide();
	});
	// Execute action on remove modal
	$scope.$on('modalKeranjang.removed', function () {
		// Execute action
	});

	$scope.jumlahBarangChange = function () {
		$scope.item.total_harga = $rootScope.jumlahHariSewa * $scope.item.jumlah_barang * $scope.item.harga_sewa;
	};

})
.controller('profilCtrl', function ($scope, $state, action, $rootScope) {} )
.controller('menuCtrl', function ($scope, $state) {} )
.controller('masukCtrl', function ($scope, $state, action, service, $rootScope, md5, $localStorage) {
	$scope.data = {};
	$scope.login = function () {

		if (!$scope.data.username || !$scope.data.password) {
			action.showAlert('Peringatan!', 'Username atau password belum diisi..!');
		}

		service.loginCustomer($scope.data.username, md5.createHash($scope.data.password)).then(
			function successCallback(response) {
				if (response.data.success) {
					action.showAlert('Sukses', response.data.success);
					$rootScope.pelanggan = response.data.pelanggan;
					$localStorage.login_customer = response.data.pelanggan;
					//window.localStorage.setItem("login_customer", response.data.pelanggan);
					$state.go('tabsController.beranda');
				} else {
					action.showAlert('Login gagal!', response.data.error);
				}
			},
			function errorCallback(response) {
				action.showAlert('Login gagal!', 'Mohon periksa koneksi anda!');
			}
		);
	};
})
.controller('daftarCtrl', function ($scope, $state, action, camera, service, $rootScope, md5, $localStorage) {

	$scope.user			= {};

	$scope.fotoProfil	= null;
	$scope.fotoKTP		= null;

	$scope.register = function () {

		if (!$scope.user.nama_pelanggan || !$scope.user.username || !$scope.user.password) {
			action.showAlert('Peringatan!', 'Form belum diisi..!');
		}

		$scope.user.password = md5.createHash($scope.user.password);
		// console.log($scope.user);
		service.registerCustomer($scope.user, $scope.fotoProfil, $scope.fotoKTP).then(
			function successCallback(response) {
				if (response.data.success) {
					// console.log(response.data.barang);
					// console.log(response.data.barangFotoByIdAll);
					// $rootScope.barang = response.data.barang;
					// $rootScope.barangFotoByIdAll = response.data.barangFotoByIdAll;
					action.showAlert('Sukses', response.data.success);
					$state.go('tabsController.beranda');
				} else if (response.data.error && response.data.warning) {
					// console.log(response.data.barang);
					action.showAlert('Pendaftaran gagal!', response.data.error);
				} else {
					action.showAlert('Pendaftaran gagal!', response.data.error);
				}
			},
			function errorCallback(response) {
				// $rootScope.barang = {};
				// console.log(response + " " + md5.createHash($scope.data.password));
				action.showAlert('Login gagal!', 'Mohon periksa koneksi anda!');
			}
		);
	};

	$scope.takeProfilePicture = function () {
		var options = {
			quality: 100,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.CAMERA,		// CAMERA | PHOTOLIBRARY | SAVEDPHOTOALBUM | 0: Photo Library, 1: Camera, 2: Saved Photo Album
			mediaType: Camera.MediaType.PICTURE,
			allowEdit: false,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 1024,
			targetHeight: 768,
			popoverOptions: CameraPopoverOptions,
			//saveToPhotoAlbum: false,
			correctOrientation: true
		};

		camera.getPicture(options).then(function (imageData) {
			var currentName = imageData.replace(/^.*[\\\/]/, '');
			$scope.fotoProfil = currentName;
			//action.showAlert('Success', $scope.fotoProfil);
		}, function (err) {
			action.showAlert('Error', err);
			console.log(err);
		});
	};

	$scope.getProfilePicture = function () {
		var options = {
			quality: 50,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,	// CAMERA | PHOTOLIBRARY | SAVEDPHOTOALBUM
			allowEdit: false,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 1024,
			targetHeight: 768,
			popoverOptions: CameraPopoverOptions,
			//saveToPhotoAlbum: false,
			correctOrientation: true
		};

		camera.getPicture(options).then(function (imageData) {
			$scope.fotoProfil = imageData;
		}, function (err) {
			console.log(err);
		});
	};

	$scope.takeIdentityPicture = function () {
		var options = {
			quality: 50,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.CAMERA,		// CAMERA | PHOTOLIBRARY | SAVEDPHOTOALBUM | 0: Photo Library, 1: Camera, 2: Saved Photo Album
			mediaType: Camera.MediaType.PICTURE,
			allowEdit: false,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 1024,
			targetHeight: 768,
			popoverOptions: CameraPopoverOptions,
			//saveToPhotoAlbum: false,
			correctOrientation: true
		};

		camera.getPicture(options).then(function (imageData) {
			$scope.fotoKTP = imageData;
		}, function (err) {
			console.log(err);
		});
	};

	$scope.getIdentityPicture = function () {
		var options = {
			quality: 50,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM, // PHOTOLIBRARY
			allowEdit: false,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 1024,
			targetHeight: 768,
			popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false,
			correctOrientation: true
		};

		camera.getPicture(options).then(function (imageData) {
			$scope.fotoKTP = imageData;
		}, function (err) {
			console.log(err);
		});
	};
})
.controller('transaksiSayaCtrl',  function ($scope, $state, $rootScope, action, service, $localStorage, $interval) {

    $scope.$on("$ionicView.loaded", function () {
        //console.log('Transaksi');
        $scope.getInitTransaction();
    });

    $scope.getInitTransaction = function () {
        action.getInitTransaction($localStorage.login_customer.id_pelanggan).then(
        	function successCallback(response) {
                //console.log(response.data);
                $rootScope.transaksiTungguAll = response.data.transaksiTungguAll;
                $rootScope.transaksiProsesAll = response.data.transaksiProsesAll;
        	},
        	function errorCallback(response) {
        		//$rootScope.logo = 'assets/img/no_image.png';
        		// console.log(response.data);
        		// action.showAlert('Maaf', response.data.error);
        	}
        );
    };
    
    $scope.riwayatTransaksiSelesai = function () {
        action.getTransaction($localStorage.login_customer.id_pelanggan, 'selesai').then(
            function successCallback(response) {
                $rootScope.transaksiSelesaiAll = response.data.transaksiAll;
                $state.go('tabsController.riwayatTransaksiSelesai');
            },
            function errorCallback(response) {
                // $rootScope.barang = {};
                // console.log(response + " " + md5.createHash($scope.data.password));
                action.showAlert('Login gagal!', 'Mohon periksa koneksi anda!');
            }
        );
    };

    $scope.riwayatTransaksiBatal = function () {
        action.getTransaction($localStorage.login_customer.id_pelanggan, 'batal').then(
            function successCallback(response) {
                $rootScope.transaksiBatalAll = response.data.transaksiAll;
                $state.go('tabsController.riwayatTransaksiBatal');
            },
            function errorCallback(response) {
                // $rootScope.barang = {};
                // console.log(response + " " + md5.createHash($scope.data.password));
                action.showAlert('Login gagal!', 'Mohon periksa koneksi anda!');
            }
        );
    };

    $scope.detailTransaksi = function (idTransaksi) {
        action.getTransactionById(idTransaksi).then(
            function successCallback(response) {
                //$interval.cancel($interval);
                $rootScope.transaksi = response.data.transaksi;
                $state.go('rincianTransaksi');
            },
            function errorCallback(response) {
                // $rootScope.barang = {};
                // console.log(response + " " + md5.createHash($scope.data.password));
                action.showAlert('Login gagal!', 'Mohon periksa koneksi anda!');
            }
        );
    };

    $rootScope.interval = ($rootScope.transaksiTungguAll || $rootScope.transaksiProsesAll) ? $interval($scope.getInitTransaction, 5000) : null;

} )
.controller('riwayatTransaksiSelesaiCtrl', function ($scope, $state, $rootScope, action, service, $localStorage) {

    $scope.detailTransaksi = function (idTransaksi) {
        action.getTransactionById(idTransaksi).then(
            function successCallback(response) {
                $rootScope.transaksi = response.data.transaksi;
                $state.go('rincianTransaksi');
            },
            function errorCallback(response) {
                // $rootScope.barang = {};
                // console.log(response + " " + md5.createHash($scope.data.password));
                action.showAlert('Login gagal!', 'Mohon periksa koneksi anda!');
            }
        );
    };

    $scope.goToRating = function ($idTransaksi) {
        action.getTransactionById($rootScope.transaksi.id_transaksi).then(
            function successCallback(response) {
                $rootScope.transaksi = response.data.transaksi;
                $state.go('formRating');
            },
            function errorCallback(response) {
                // $rootScope.barang = {};
                // console.log(response + " " + md5.createHash($scope.data.password));
                action.showAlert('Login gagal!', 'Mohon periksa koneksi anda!');
            }
        );
    };

} )
.controller('riwayatTransaksiBatalCtrl', function ($scope, $state, $rootScope, action, service, $localStorage) {

    $scope.detailTransaksi = function (idTransaksi) {
        action.getTransactionById(idTransaksi).then(
            function successCallback(response) {
                $rootScope.transaksi = response.data.transaksi;
                $state.go('rincianTransaksi');
            },
            function errorCallback(response) {
                // $rootScope.barang = {};
                // console.log(response + " " + md5.createHash($scope.data.password));
                action.showAlert('Login gagal!', 'Mohon periksa koneksi anda!');
            }
        );
    };

    $scope.goToRating = function ($idTransaksi) {
        action.getTransactionById($rootScope.transaksi.id_transaksi).then(
            function successCallback(response) {
                $rootScope.transaksi = response.data.transaksi;
                $state.go('formRating');
            },
            function errorCallback(response) {
                // $rootScope.barang = {};
                // console.log(response + " " + md5.createHash($scope.data.password));
                action.showAlert('Login gagal!', 'Mohon periksa koneksi anda!');
            }
        );
    };

} )
.controller('formTransaksiCtrl', function ($scope, $state, $rootScope, $ionicHistory, action, service, $localStorage, $cordovaGeolocation, NgMap, $ionicLoading ) {
    //$scope.transactionData = {};
    $scope.myGoBack = function () {
		$ionicHistory.goBack();
    };

    $scope.totalCost = 20000;

    $scope.map = {};
    $scope.marker = {};
    $scope.searchBox = {};
    $scope.place = {};
    $scope.bounds = {};

	$rootScope.transactionData.id_pelanggan = $rootScope.pelanggan.id_pelanggan;
    $rootScope.transactionData.no_telp = $rootScope.pelanggan.telepon;
    //$rootScope.transactionData.tgl_awal_transaksi = $rootScope.tglAwal;
    //$rootScope.transactionData.tgl_akhir_transaksi = $rootScope.tglAwal;
    //$rootScope.transactionData.jumlah_hari = $rootScope.jumlahHariSewa;

	$scope.transactionData = {
        id_pelanggan: $rootScope.pelanggan.id_pelanggan,
        nama_pelanggan: $rootScope.pelanggan.nama_pelanggan,
        no_telp: $rootScope.transactionData.no_telp,
        keterangan: $rootScope.transactionData.keterangan,
        diantarkan: $rootScope.transactionData.diantarkan,
        alamat_pengantaran: $rootScope.transactionData.alamat_pengantaran,
        tgl_pengantaran: $rootScope.transactionData.tgl_pengantaran,
        latlong: $rootScope.transactionData.latlong,
        totalBayar: 0
    };

    $scope.initTotalBayar = function(totalBayar, totalHarga) {
        $scope.transactionData.totalBayar = parseInt(totalBayar) + parseInt(totalHarga);
    };

    $scope.shippingChange = function () {
        if ($scope.transactionData.diantarkan === true) {
            $scope.reArrangePrice('+');
        } else if ($scope.transactionData.diantarkan === false) {
            $scope.reArrangePrice('-');
        }
    };

    $scope.reArrangePrice = function (operator = '+') {
        //var result = (operator === '+') ? : ;
        if (operator === '+') {
            $rootScope.itemsToTransaction.push(angular.copy({
                id_keranjang: 0,
                id_barang: 0,
                id_toko: 0,
                nama_barang: 'Biaya Pengantaran',
                stok_barang: 0,
                harga_sewa: parseInt($scope.totalCost),
                jumlah_barang: 1,
                tglAwal: $rootScope.tglAwal,
                tglAkhir: $rootScope.tglAkhir,
                jumlahHariSewa: parseInt($rootScope.jumlahHariSewa),
                total_harga: parseInt($scope.totalCost),
                available: true
            }));
        } else if (operator === '-') {
            $rootScope.itemsToTransaction.splice($rootScope.itemsToTransaction.indexOf('Biaya Pengantaran'), 1);
        }
    };

    $scope.nextPage = function (step = 2) {
        switch (step) {
            case 1:

                break;
            case 2:
                if ($scope.transactionData.diantarkan === true) {
                    //$scope.reArangePrice('+');
                    $state.go('formPengantaran');
                } else {
                    $state.go('formKonfirmasi');
                }
                break;
            case 3:
                $state.go('formKonfirmasi');
                break;
        }
        $rootScope.transactionData.no_telp = $scope.transactionData.no_telp;
        $rootScope.transactionData.keterangan = $scope.transactionData.keterangan;
        $rootScope.transactionData.diantarkan = $scope.transactionData.diantarkan;
        $rootScope.transactionData.tgl_pengantaran = $scope.transactionData.tgl_pengantaran;
        $rootScope.transactionData.alamat_pengantaran = $scope.transactionData.alamat_pengantaran;
        $rootScope.transactionData.latlong = $scope.transactionData.latlong;
    };

    //$ionicLoading.show({
    //    template: 'Getting current position ...'
    //});

    $scope.initMap = function (map) {
        $scope.map = map;
        $scope.$apply();

        $scope.map = google.maps.event.addListener($scope.map, 'center_changed', () => {
            var center = map.getCenter();
            $scope.transactionData.latlong = center.lat() + ',' + center.lng();
            marker.setPosition(center);
            //console.log($scope.transactionData.latlong);
        });

        marker = new google.maps.Marker({
            position: map.getCenter(),
            map: map,
            animation: google.maps.Animation.DROP,
            icon: { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" },
            title: 'Click to zoom'
        });

        marker.addListener('click', function () {
            map.setZoom(18);
            map.setCenter(marker.getPosition());
            //var info = (searchBox.getPlace()) ? searchBox.getPlace()['adr_address'] : "Alamat Belum dimasukan..!";
            //infoWindow.setContent("<div style='text-align: center;'>" + info + "</div>");
            //infoWindow.open(map, marker)
        });

        searchBox = new google.maps.places.Autocomplete(document.getElementById('alamat_pengantaran'), {
            componentRestrictions: {
                country: 'id' // ['us', 'pr', 'vi', 'gu', 'mp']
            }
        });

        searchBox.addListener('place_changed', function () { // places_changed
            place = searchBox.getPlace();

            // For each place, get the icon, name and location.
            bounds = new google.maps.LatLngBounds();

            // places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

            // Create a marker for each place.
            marker.setPosition(place.geometry.location);

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
            // });
            map.fitBounds(bounds);
            // map.setCenter(marker.getPosition());
        });

    }

	$scope.submitTransaksi = function () {
		service.addItemToTransaction($rootScope.transactionData, $rootScope.itemsToTransaction, $localStorage.login_customer.id_pelanggan).then(
            function successCallback(response) {
                if (response.data.success) {
                    action.showAlert('Sukses', response.data.message);
                    $rootScope.itemsToTransaction = [];
                    $rootScope.transactionData = {};
                    $rootScope.reloadRead();
                    $state.go('tabsController.beranda');
                } else if (response.data.error && response.data.warning) {
                    action.showAlert('Peringatan!', response.data.message);
                } else {
                    action.showAlert('Peringatan!', response.data.message);
                }
            }, function errorCallback(response) {
                action.showAlert('Proses Gagal!', 'Mohon periksa koneksi anda!');
            }
		);
	};
})
.controller('formPengantaranCtrl', function ($scope, $state) {} )
.controller('formKonfirmasiCtrl', function ($scope, $state) {} )
.controller('formRatingCtrl', function ($scope, $state, $rootScope, $ionicHistory, action, service, $localStorage, $interval) {
    $scope.ratings = {
        rating: 4,
        ulasan: null
    };

    $scope.getStar = function ($event) {
        $scope.ratings.rating = $event.rating;
    };

    $scope.submitRatings = function (ratings) {
        service.addRatingsToTransaction($localStorage.login_customer.id_pelanggan, $rootScope.transaksi.id_transaksi, ratings).then(
            function successCallback(response) {
                if (response.data.success) {
                    action.showAlert('Sukses', response.data.success);
                    $interval.cancel($rootScope.interval);
                    $rootScope.reloadRead();
                    $state.go('tabsController.transaksiSaya');
                } else if (response.data.error && response.data.warning) {
                    action.showAlert('Peringatan!', response.data.message);
                } else {
                    action.showAlert('Peringatan!', response.data.message);
                }
            }, function errorCallback(response) {
                action.showAlert('Proses Gagal!', 'Mohon periksa koneksi anda!');
            }
        );
    };
})
.controller('rincianTransaksiCtrl', function ($scope, $rootScope, $state, action, service, $ionicHistory, $interval) {

    $scope.itemArrived = false;
    $scope.confirmReturn = false;
    $scope.confirmFinish = false;

    $scope.myGoBack = function () {
        $interval.cancel(interval);
        $ionicHistory.goBack();
    };

    $scope.$on("$ionicView.loaded", function () {
        $scope.showItemsArrived($rootScope.transaksi);
        $scope.showConfirmReturn($rootScope.transaksi);
        $scope.showConfirmFinish($rootScope.transaksi);
    });

    $scope.showItemsArrived = function (transaksi) {
        $scope.itemArrived = ((transaksi.status_transaksi == 'proses') && (transaksi.status_pengembalian == 'belum') && (transaksi.toko_check == 'sudah') && (transaksi.pelanggan_check == 'belum')) ? true : false ;
    }

    $scope.showConfirmReturn = function (transaksi) {
        $scope.confirmReturn = ((transaksi.status_transaksi == "proses") && (transaksi.status_pengembalian == "belum") && (transaksi.toko_check == "sudah") && (transaksi.pelanggan_check == "sudah")) ? true : false ;
    }

    $scope.showConfirmFinish = function (transaksi) {
        $scope.confirmFinish = ((transaksi.status_transaksi == "proses") && (transaksi.status_pengembalian == "sudah") && (transaksi.toko_check == "selesai") && (transaksi.pelanggan_check == "sudah")) ? true : false ;
    }

    $scope.setItemsArrived = function (transaksi) {
        action.showConfirm($scope, 'Konfirmasi..!', 'Apakah anda yakin barang telah sampai..?').then(
            function successCallback(confirmResponse) {
                if (confirmResponse === true) {
                    service.setItemArrived(transaksi.id_transaksi).then(
                        function successCallback(response) {
                            if (response.data.success) {
                                action.showAlert('Sukses', response.data.message);
                                $scope.itemArrived = false;
                                $rootScope.reloadRead();
                                $state.go('tabsController.transaksiSaya');
                            } else if (response.data.error && response.data.warning) {
                                action.showAlert('Proses Gagal!', response.data.message);
                            } else {
                                action.showAlert('Proses Gagal!', response.data.message);
                            }
                        }, function errorCallback(response) {
                            action.showAlert('Proses Gagal!', 'Mohon periksa koneksi anda!');
                        }
                    );
                }
            }, function errorCallback(response) {
                //
            }
        );
    }

    $scope.setConfirmReturn = function (transaksi) {
        action.showConfirm($scope, 'Konfirmasi..!', 'Apakah anda yakin ingin mengembalikan transaksi ini..?').then(
            function successCallback(confirmResponse) {
                if (confirmResponse === true) {
                    service.setConfirmReturn(transaksi.id_transaksi).then(
                        function successCallback(response) {
                            if (response.data.success) {
                                action.showAlert('Sukses', response.data.message);
                                $scope.confirmReturn = false;
                                $rootScope.reloadRead();
                                $state.go('tabsController.transaksiSaya');
                            } else if (response.data.error && response.data.warning) {
                                action.showAlert('Proses Gagal!', response.data.message);
                            } else {
                                action.showAlert('Proses Gagal!', response.data.message);
                            }
                        }, function errorCallback(response) {
                            action.showAlert('Proses Gagal!', 'Mohon periksa koneksi anda!');
                        }
                    );
                }
            }, function errorCallback(response) {
                //
            }
        );
    }

    $scope.setTransactionFinish = function (transaksi) {
        action.showConfirm($scope, 'Konfirmasi..!', 'Apakah anda yakin ingin menyelesaikan transaksi ini..?').then(
            function successCallback(confirmResponse) {
                if (confirmResponse === true) {
                    service.setTransactionFinish(transaksi.id_transaksi).then(
                        function successCallback(response) {
                            if (response.data.success) {
                                action.showAlert('Sukses', response.data.message);
                                $scope.confirmFinish = true;
                                $rootScope.transaksi = {};
                                $scope.goToRating(transaksi.id_transaksi);
                            } else if (response.data.error && response.data.warning) {
                                action.showAlert('Proses Gagal!', response.data.message);
                            } else {
                                action.showAlert('Proses Gagal!', response.data.message);
                            }
                        }, function errorCallback(response) {
                            action.showAlert('Proses Gagal!', 'Mohon periksa koneksi anda!');
                        }
                    );
                }
            }, function errorCallback(response) {
                //
            }
        );
    }

    $scope.goToRating = function (idTransaksi) {
        action.getTransactionById(idTransaksi).then(
            function successCallback(response) {
                $rootScope.transaksi = response.data.transaksi;
                $state.go('formRating');
            },
            function errorCallback(response) {
                // $rootScope.barang = {};
                // console.log(response + " " + md5.createHash($scope.data.password));
                action.showAlert('Login gagal!', 'Mohon periksa koneksi anda!');
            }
        );
    };

    $scope.detailTransaksi = function () {
        //console.log($rootScope.transaksi);
        action.getTransactionById($rootScope.transaksi.id_transaksi).then(
            function successCallback(response) {
                $rootScope.transaksi = response.data.transaksi;
            },
            function errorCallback(response) {
                // $rootScope.barang = {};
                // console.log(response + " " + md5.createHash($scope.data.password));
                action.showAlert('Login gagal!', 'Mohon periksa koneksi anda!');
            }
        );
        $scope.showItemsArrived($rootScope.transaksi);
        $scope.showConfirmReturn($rootScope.transaksi);
        $scope.showConfirmFinish($rootScope.transaksi);
    };

    $rootScope.interval = ($rootScope.transaksi) ? $interval($scope.detailTransaksi, 5000) : null ;

} )
.controller('rincianBarangCtrl', function ($scope, $state, $ionicHistory, action, service, $rootScope, $localStorage, $ionicModal) {
	$scope.myGoBack = function() {
		$ionicHistory.goBack();
	};
    $scope.barang = $rootScope.barang;
    $scope.barang.available = false;

	$scope.item = {
        id_barang: parseInt($scope.barang.id_barang),
        nama_barang: $scope.barang.nama_barang,
		stok_barang: parseInt($scope.barang.stok),
		harga_sewa: parseInt($scope.barang.harga_sewa),
		jumlah_barang: 1,
		tgl_sewa_awal: $rootScope.tglAwal,
		tgl_sewa_akhir: $rootScope.tglAkhir,
        jumlah_hari: parseInt($rootScope.jumlahHariSewa),
        total_harga: parseInt($rootScope.jumlahHariSewa) * 1 * parseInt($scope.barang.harga_sewa),
        available: $scope.barang.available,
        id_toko: parseInt($scope.barang.id_toko)
	};

	$scope.modalKeranjangState = false;
	$scope.modalOrderState = false;

	$scope.jumlahBarangChange = function () {
        $scope.item.total_harga = parseInt($rootScope.jumlahHariSewa) * parseInt($scope.item.jumlah_barang) * parseInt($scope.item.harga_sewa);
	};

    $scope.tambahKeranjang = function (item) {
        if (!item.jumlah_barang) {
            action.showAlert('Peringatan!', 'Mohon periksa kembali Jumlah Barang anda.');
        } else {
            if ((item.jumlah_barang > item.stok_barang) || !(item.jumlah_barang <= item.stok_barang)) {
                action.showAlert('Peringatan!', 'Jumlah Barang yang anda masukan melebihi stok yang ada.');
            } else {
                action.showConfirm($scope, 'Konfirmasi..!', 'Apakah anda yakin isian sudah benar..?').then(
                    function successCallback(confirmResponse) {
                        if (confirmResponse === true) {
                            action.checkItemAvailable(item).then(
                                function successCallback(response) {
                                    if (response.data.available === true) {
                                        //action.showAlert('Sukses', response.data.message);
                                        item.available = true;
                                    } else {
                                        item.available = false;
                                        action.showAlert('Info', (response.data.message) ? response.data.message : 'Item tidak tersedia untuk rentang tanggal yang anda pilih!' );
                                    }
                                    if ($scope.item.available == true) {
                                        service.addItemToCart(item, $localStorage.login_customer.id_pelanggan).then(
                                            function successCallback(response) {
                                                if (response.data.success) {
                                                    action.showAlert('Sukses', response.data.success);
                                                    $scope.closeModalKeranjang();
                                                    $rootScope.reloadRead();
                                                } else if (response.data.error && response.data.warning) {
                                                    action.showAlert('Proses Gagal!', response.data.error);
                                                } else {
                                                    action.showAlert('Proses Gagal!', response.data.error);
                                                }
                                            }, function errorCallback(response) {
                                                action.showAlert('Proses Gagal!', 'Mohon periksa koneksi anda!');
                                            }
                                        );
                                    }
                                }, function errorCallback(response) {
                                    action.showAlert('Proses Gagal!', 'Mohon periksa koneksi anda!');
                                }
                            );
                        }
                    }, function errorCallback(response) {
                        //
                    }
                );
            }
        }
	};

	$scope.prosesOrder = function (item) {
        if (!item.jumlah_barang) {
            action.showAlert('Peringatan!', 'Mohon periksa kembali Jumlah Barang anda.');
        } else {
            if ((item.jumlah_barang > item.stok_barang) || !(item.jumlah_barang <= item.stok_barang)) {
                action.showAlert('Peringatan!', 'Jumlah Barang yang anda masukan melebihi stok yang ada.');
            } else {
                action.showConfirm($scope, 'Konfirmasi..!', 'Apakah anda yakin isian sudah benar..?').then(
                    function successCallback(confirmResponse) {
                        if (confirmResponse === true) {
                            action.checkItemAvailable(item).then(
                                function successCallback(response) {
                                    if (response.data.available === true) {
                                        //action.showAlert('Sukses', response.data.message);
                                        item.available = true;
                                    } else {
                                        item.available = false;
                                        action.showAlert('Info', (response.data.message) ? response.data.message : 'Item tidak tersedia untuk rentang tanggal yang anda pilih!');
                                    }
                                    if ($scope.item.available == true) {
                                        $rootScope.itemsToTransaction.push(angular.copy($scope.item));
                                        $scope.closeModalOrder();
                                        $state.go('formTransaksi');
                                    }
                                }, function errorCallback(response) {
                                    action.showAlert('Proses Gagal!', 'Mohon periksa koneksi anda!');
                                }
                            );
                        }
                    }, function errorCallback(response) {
                        //
                    }
                );
            }
        }
    };

    $ionicModal.fromTemplateUrl('templates/modal/modalInputKeranjang.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalKeranjang = modal;
    });

    $scope.openModalKeranjang = function () {
        if (!$rootScope.tglAwal || !$rootScope.tglAkhir) {
            action.showAlert('Peringatan!', 'Anda belum menentukan tanggal penyewaan..!');
            $state.go('tabsController.beranda');
        } else {
            $scope.modalKeranjang.show();
            $scope.modalKeranjangState = true;
        }
    };
    $scope.closeModalKeranjang = function () {
        //$scope.modalKeranjang.remove();
        angular.element(document.querySelector('body')).removeClass('modal-open');
        $scope.modalKeranjang.hide();
        $scope.modalKeranjangState = false;
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modalKeranjang.remove();
    });
    // Execute action on hide modal
    $scope.$on('modalKeranjang.hidden', function () {
        $scope.modalKeranjang.hide();
    });
    // Execute action on remove modal
    $scope.$on('modalKeranjang.removed', function () {
        // Execute action
    });

    $ionicModal.fromTemplateUrl('templates/modal/modalInputOrder.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalOrder = modal;
    });

    $scope.openModalOrder = function () {
        if (!$rootScope.tglAwal || !$rootScope.tglAkhir) {
            action.showAlert('Peringatan!', 'Anda belum menentukan tanggal penyewaan..!');
            $state.go('tabsController.beranda');
            $scope.closeModalOrder();
        } else {
            $scope.modalOrder.show();
            $scope.modalOrderState = true;
        }

    };
    $scope.closeModalOrder = function () {
        //$scope.modalOrder.remove();
        angular.element(document.querySelector('body')).removeClass('modal-open');
        $scope.modalOrder.hide();
        $scope.modalOrderState = false;
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modalOrder.remove();
    });
    // Execute action on hide modal
    $scope.$on('modalOrder.hidden', function () {
        $scope.modalOrder.hide();
    });
    // Execute action on remove modal
    $scope.$on('modalOrder.removed', function () {
        // Execute action
    });

})
.controller('editProfilCtrl', function ($scope, $state) {} )
.controller('editEmailCtrl', function ($scope, $state) {} )
.run(function ($rootScope, $state, action, service, $localStorage, md5, $interval) {

    $rootScope.interval = null;

	$rootScope.isLogin = false;

	$rootScope.serverURL = 'http://127.0.0.1/ketam_mp'

    $rootScope.konfigurasiAll = {};
    $rootScope.coordinate = {
        latitude: -5.147665,
        longitude: 119.432732,
        string: '-5.147665,119.432732'
    }
	$rootScope.logo = 'assets/img/no_image.png';
	$rootScope.notifikasiAll = {};
	$rootScope.pesanAll = {};

	$rootScope.tglAwal = new Date('2020-10-25');
	$rootScope.tglAkhir = new Date('2020-10-30');
	$rootScope.jumlahHariSewa = 0;

	$rootScope.pelanggan = {};
	$rootScope.barang = {};
	$rootScope.barangAll = {};
	$rootScope.barangFotoByIdAll = {};
	$rootScope.toko = {};
	$rootScope.tokoAll = {};
	$rootScope.keranjangAll = {};
    $rootScope.transaksi = {};
    $rootScope.transaksiAll = {};
    $rootScope.transaksiTungguAll = {};
    $rootScope.transaksiProsesAll = {};
    $rootScope.transaksiSelesaiAll = {};
    $rootScope.transaksiBatalAll = {};
	$rootScope.itemsToTransaction = [];
	$rootScope.transactionData = {
		no_transaksi: null,
		tgl_transaksi: new Date(),
		id_pelanggan: null,
		no_telp: null,
		keterangan: null,
		diantarkan: false,
		alamat_pengantaran: '',
		tgl_pengantaran: null,
		id_toko: null,
		latlong: $rootScope.coordinate.string,
		tgl_awal_transaksi: null,
		tgl_akhir_transaksi: null,
		jumlah_hari: null,
		tgl_pengembalian: null
    };

    $rootScope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyB6bHo5JkixK-_Ct1TWEy4ZDdiuRqbwkpw&libraries=places&locationbias=circle:500@-5.147665,119.432732";

	$rootScope.reloadRead = function () {
		//action.getInitHome().then(
		//	function successCallback(response) {
		//		// console.log(response.data.data);
		//		$rootScope.barangAll = response.data.data;
		//	},
		//	function errorCallback(response) {
		//		$rootScope.barangAll = {};
		//		$rootScope.barang = {};
		//		$rootScope.toko = {};
		//	}
		//);
		if ($localStorage.login_customer) {
			action.getInitHomeIfLogin($localStorage.login_customer.id_pelanggan).then(
				function successCallback(response) {
					$rootScope.keranjangAll = response.data.keranjangAll;
                    $rootScope.transaksiAll = response.data.transaksiAll;
                    $rootScope.transaksi = {};
				},
				function errorCallback(response) {
					$rootScope.keranjangAll = {};
                    $rootScope.transaksiAll = {};
                    $rootScope.transaksi = {};
				}
			);
		}
    }
    
    //$interval($rootScope.reloadRead, 1000);

	$rootScope.first_login = function (user) {
		// console.log(user.username + " " + user.password);
		service.loginCustomer(user.username, user.password)
			.success(function (response) {
				if (response.error) {
					action.showAlert('Maaf', 'Akun Anda Tidak Bisa Login, Silahkan Mencoba Kembali');
					delete $localStorage.login_customer;
				} else if (response.success) {
					// action.showAlert('Sukses',data.pesan);
					$rootScope.pelanggan = response.pelanggan;
					$state.go('tabsController.beranda');
				}
				// action.loadinghide();
			});
	}

	if ($localStorage.login_customer) {
		$rootScope.first_login($localStorage.login_customer);
	}

	$rootScope.logout = function () {
		$rootScope.pelanggan = {};
		delete $localStorage.login_customer;
		$rootScope.hideShow();
		action.showAlert('Success', 'Anda berhasil keluar..!');
		$state.go('tabsController.beranda');
	}

	$rootScope.showHide = function () {
		$rootScope.isLogin = true;
	}

	$rootScope.hideShow = function () {
		$rootScope.isLogin = false;
	}

});
