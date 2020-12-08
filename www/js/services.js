
var server = "http://127.0.0.1/ketam_mp/service/"; // To AVD : http://10.0.2.2/ketam-mp/service/
var action = {};

angular.module('app.services', ["angular-md5", "ngCordova"])

.factory('action', function ($q, $http, $ionicPopup, $ionicModal, $filter) {

	action.showAlert = function (title, message) {
		var alertPopup = $ionicPopup.alert({
			title: title,
			template: message
		});
		alertPopup.then(function (result) {
			if (result) {

			} else {
				//alert('You are not sure');
			}
		});
	};

	action.showConfirm = function ($scope, title, message) {
		var q = $q.defer();
		var confirmPopup = $ionicPopup.confirm({
			scope: $scope,
			title: title,
			template: message
		});
		confirmPopup.then(function (result) {
			if (result) {
				//return true;
				q.resolve(true);
			} else {
				//alert('You are not sure');
				//return false;
				q.resolve(false);
			}
		});
		return q.promise;
	};

	action.showModalKeranjang = function ($scope) {
		//console.log('Modal Keranjang');

		$scope.openModal = function () {
			$scope.modal.show();
		};
		$scope.closeModal = function () {
			$scope.modal.hide();
		};
		// Cleanup the modal when we're done with it!
		$scope.$on('$destroy', function () {
			$scope.modal.remove();
		});
		// Execute action on hide modal
		$scope.$on('modal.hidden', function () {
			// Execute action
		});
		// Execute action on remove modal
		$scope.$on('modal.removed', function () {
			// Execute action
		});

		return $ionicModal.fromTemplateUrl('templates/modal/modalKeranjang.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modal = modal;
		});
	}

	action.getKonfigurasiUmumAll = function () {
		return $http({
			method: 'POST',
			url: server + '?action=get_konfigurasi_umum',
			data: {
				filter: 'all'
			},
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
	};

	action.getKonfigurasiUmum = function (filter) {
		return $http({
			method: 'POST',
			url: server + '?action=get_konfigurasi_umum',
			data: {
				filter: filter
			},
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
	};

	action.getInitHome = function () {
		return $http({
			method: 'GET',
			url: server + '?action=get_init_home',
			data: { filter: 'all' },
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
	};

	action.getInitHomeIfLogin = function (id_pelanggan) {
		return $http({
			method: 'POST',
			url: server + '?action=get_init_home_if_login',
			data: { 'id_pelanggan': id_pelanggan },
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
	};

	action.getKeranjangAllByIdPelanggan = function (idPelanggan) {
		return $http({
			method: 'GET',
			url: server + '?action=get_keranjang&filter=all&id_pelanggan=' + idPelanggan,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	action.getTransaksiAllByIdPelanggan = function (idPelanggan) {
		return $http({
			method: 'GET',
			url: server + '?action=get_transaksi&filter=all&id_pelanggan=' + idPelanggan,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	action.getInitTransaction = function (idPelanggan) {
		return $http({
			method: 'GET',
			url: server + '?action=get_init_transaction&id_pelanggan=' + idPelanggan
		});
	};

	action.getTransactionAll = function (idPelanggan, filter = null) {
		var filter = ($filter === null) ? 'all' : filter ;
		return $http({
			method: 'GET',
			url: server + '?action=get_transaction&id_pelanggan=' + idPelanggan + '&filter=' + filter
		});
	};

	action.getTransaction = function (idPelanggan, filter = null) {
		var filter = ($filter === null) ? 'all' : filter;
		return $http({
			method: 'GET',
			url: server + '?action=get_transaction&id_pelanggan=' + idPelanggan + '&filter=' + filter
		});
	};

	action.getTransactionById = function (idTransaksi) {
		return $http({
			method: 'GET',
			url: server + '?action=get_transaction_by_id&id_transaksi=' + idTransaksi
		});
	};

	action.getBarangAll = function () {
		return $http({
			method: 'GET',
			url: server + '?action=get_barang&filter=all',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	action.getBarangById = function (idBarang = null) {
		// console.log(idBarang);
		return $http({
			method: 'GET',
			url: server + '?action=get_barang&id_barang=' + idBarang
		});
	};

	action.searchItem = function (tglAwal = null, tglAkhir = null, keyWord) {
		// console.log(searchKey + ' ' + tglAwal + ' ' + tglAkhir);
		return $http({
			method: 'GET',
			url: server + '?action=search_item&tgl_awal=' + tglAwal + '&tgl_akhir=' + tglAkhir + '&keyword=' + keyWord
		});
	};

    action.checkItemAvailable = function (item) {
        return $http({
            method: 'GET',
            url: server + '?action=check_item_available&idBarang=' + item.id_barang + '&tglAwal=' + $filter('date')(item.tglAwal, 'yyyy-MM-dd') + '&tglAkhir=' + $filter('date')(item.tglAkhir, 'yyyy-MM-dd')
		});
	};

	return action;
})

.factory('camera', function ($q, $http, $ionicPopup, $cordovaCamera, $cordovaFile, $cordovaDevice) {
	return {
		getPicture: function (options) {
			var q = $q.defer();
			var namePath = "";
			var fileName = "";

			$cordovaCamera.getPicture(options).then(function success(imagePath) {
				// Grab the file name of the photo in the temporary directory
				var currentName = imagePath.replace(/^.*[\\\/]/, '');

				//Create a new name for the photo
				var dateNow = new Date(),
					timeNow = dateNow.getTime(),
					newFileName = timeNow + ".jpg";

				// If you are trying to load image from the gallery on Android we need special treatment!
				if ($cordovaDevice.getPlatform() == 'Android' && options.sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
					window.FilePath.resolveNativePath(imagePath, function (entry) {
						window.resolveLocalFileSystemURL(entry,
							function success(fileEntry) {
								namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
								// Only copy because of access rights
								$cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function (success) {
									$scope.newName = newFileName;
									$scope.currentName = currentName;

									fileName = cordova.file.dataDirectory + newFileName;
									$ionicPopup.alert({
										title: 'Info on Success',
										template: 'fileName : ' + fileName
									});
									q.resolve(fileName);
								}, function (error) {
									// $rootScope.showAlert('Error', error.exception);
								});
							},
							function error(e) {
								// console.error('Error: ', e);
							}
						);
					});
				} else {

					namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
					// Move the file to permanent storage
					$cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function onSuccess(success) {
						fileName = cordova.file.dataDirectory + newFileName;
						q.resolve(fileName);
					}, function onError(error) {
						$ionicPopup.alert({
							title: 'Info on Error',
							template: 'Messager : ' + error.exception
						});
						// $rootScope.showAlert('Error', error.exception);
					});
				}
			},
			function error(err) {
				// Not always an error, maybe cancel was pressed...
			});

			// $cordovaCamera.getPicture(options).then(function (sourcePath) {
			// 	var sourceDirectory		= sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
			// 	var sourceFileName		= sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);

			// 	//$ionicPopup.alert({
			// 	//	title: 'Info',
			// 	//	template: 'Copying from : ' + sourceDirectory + sourceFileName + ' to : ' + cordova.file.dataDirectory + sourceFileName
			// 	//});
			// 	// console.log("Copying from : " + sourceDirectory + sourceFileName);
			// 	// console.log("Copying to : " + cordova.file.dataDirectory + sourceFileName);

			// 	if (options.sourceType === Camera.PictureSourceType.CAMERA) {

			// 		fileName = cordova.file.dataDirectory + sourceFileName;
			// 		q.resolve(fileName);
			// 		// $cordovaFile.copyFile(sourceDirectory, sourceFileName, cordova.file.dataDirectory, sourceFileName).then(function (success) {
			// 		// 	fileName = cordova.file.dataDirectory + sourceFileName;
			// 		// 	q.resolve(fileName);
			// 		// 	//$ionicPopup.alert({
			// 		// 	//	title: 'Info on Success',
			// 		// 	//	template: 'fileName : ' + fileName
			// 		// 	//});
			// 		// }, function (error) {
			// 		// 	//$ionicPopup.alert({
			// 		// 	//	title: 'Info on Error copyFile',
			// 		// 	//	template: '' + JSON.stringify(error.response)
			// 		// 	//});
			// 		// 	console.dir(error);
			// 		// 	q.reject(error);
			// 		// });
			// 	} else {
			// 		fileName = cordova.file.dataDirectory + sourceFileName;
			// 		q.resolve(fileName);
			// 	}
			// }, function (error) {
			// 	// console.log(err);
			// 	q.reject(error);
			// });

			return q.promise;
		}
	}
})

.factory('modal', function ($q, $rootScope, $ionicModal, $injector) {

	function _cleanup(scope) {
		scope.$destroy();
		if (scope.modal) {
			scope.modal.remove();
		}
	}

	action.show = function (templateUrl) {
		// Grab the injector and create a new scope
		var deferred = $q.defer(),
			modalScope = $rootScope.$new(),
			thisScopeId = modalScope.$id;

		$ionicModal.fromTemplateUrl(templateUrl, {
			scope: modalScope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			modalScope.modal = modal;

			modalScope.openModal = function () {
				modalScope.modal.show();
			};
			modalScope.closeModal = function (result) {
				deferred.resolve(result);
				modalScope.modal.hide();
			};
			modalScope.$on('modal.hidden', function (thisModal) {
				if (thisModal.currentScope) {
					var modalScopeId = thisModal.currentScope.$id;
					if (thisScopeId === modalScopeId) {
						deferred.resolve(null);
						_cleanup(thisModal.currentScope);
					}
				}
			});

			modalScope.modal.show();

		}, function (err) {
			deferred.reject(err);
		});

		return deferred.promise;
	}
	return action;
})

.service('service', function ($q, $http, md5, $cordovaFileTransfer, $ionicPopup) {

	//action.sendData = function () {
	//	server = "http://127.0.0.1/rest_api_lumen/public";
	//	var proccess = $http({
	//		method: "POST",
	//		url: server + "/role",
	//		data: {
	//			'slug_role': 'coba-3',
	//			'name_role': 'Coba 3'
	//		},
	//		headers: {
	//			'Content-Type': 'application/json'
	//		}
	//	});

	//	//var proccess = $http({
	//	//	method: "GET",
	//	//	url: server + "/role",
	//	//	//data: null,
	//	//	//headers: {
    //  //  //  'Content-Type': 'application/x-www-form-urlencoded'
	//	//	//}
	//	//});
    //  return proccess;
	//}

	action.login = function (logins) {
		return $http({
			method: "POST",
			url: server + "aksi.php?aksi=login",
			data: logins,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		})
	};

	action.loginCustomer = function (username, password) {
		// console.log(username + " " + password);
		return $http({
			method: 'POST',
			url: server + "?action=login",
			data: {
				'user': 'pelanggan',
				'username': username,
				'password': password
			},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	action.registerCustomer = function (pelanggan, fotoProfil, fotoKTP) {
		// console.log(pelanggan);

		//$ionicPopup.alert({
		//	title: 'Info',
		//	template: pelanggan + ' ' + fotoProfil + ' ' + fotoKTP
		//});

		var response = {};
		var uploadedFotoProfilName = null;
		var uploadedFotoKTPName = null;

		if (fotoProfil) {

			var uploadFotoProfilOptions = {
				fileKey: 'file',
				fileName: fotoProfil.substr(fotoProfil.lastIndexOf('/') + 1),
				mimeType: 'image/jpg',
				chunkedMode: false,
				params: {
					'folder': 'pelanggan',
					'type': 'img',
					'length': 'short'
				},
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			};

			$cordovaFileTransfer.upload(server + '?action=upload_file', fotoProfil, uploadFotoProfilOptions).then(
				function successCallback(message) {
					$ionicPopup.alert({
						title: 'Info',
						template: 'Upload Foto Profil : ' + JSON.stringify(message.response)
					});
					if (message.response.success) {
						uploadedFotoProfilName = message.response.file_url;

						$ionicPopup.alert({
							title: 'Info',
							template: 'Upload Foto Profil is success : ' + uploadedFotoProfilName
						});

					} else if (message.response.error | message.response.warning) {
						//action.showAlert('Pendaftaran gagal!', message.error);
						response.errors = message.response.error;
						response.warnings = message.response.warning;

						$ionicPopup.alert({
							title: 'Error',
							template: 'Upload Foto Profil is given error or warning : ' + message.error + ' ' + message.warning
						});
					}
				},
				function errorCallback(message) {
					//console.dir(message);
					// $rootScope.barang = {};
					// console.log(response + " " + md5.createHash($scope.data.password));

					$ionicPopup.alert({
						title: 'Info',
						template: 'Upload Foto Profil is error : ' + message
					});

					//action.showAlert('Unggah Foto Profil Gagal!', 'Mohon periksa koneksi anda!');
				}
			);
		}

		if (fotoKTP) {
			var uploadFotoKTPOptions = {
				fileKey: 'file',
				fileName: fotoKTP.substr(fotoKTP.lastIndexOf('/') + 1),
				mimeType: 'image/jpg',
				chunkedMode: false,
				params: {
					'folder': 'ktp',
					'type': 'img',
					'length': 'short'
				},
				headers: {  }
			};

			$cordovaFileTransfer.upload(server + '?action=upload_file', fotoKTP, uploadFotoKTPOptions).then(
				function successCallback(message) {
					if (message.data.success) {
						uploadedFotoKTPName = message.data.file_url;
					} else if (message.data.error && message.data.warning) {
						//action.showAlert('Pendaftaran gagal!', message.data.error);
						response.errors = message.data.error;
						response.warnings = message.data.warning;
					} else {
						response.errors = message.data.error;
						//action.showAlert('Pendaftaran gagal!', message.data.error);
					}
				},
				function errorCallback(message) {
					// $rootScope.barang = {};
					// console.log(response + " " + md5.createHash($scope.data.password));
					action.showAlert('Unggah Foto KTP Gagal!', 'Mohon periksa koneksi anda!');
				}
			);
		}

		pelanggan.foto = uploadedFotoProfilName;
		pelanggan.foto_ktp = uploadedFotoKTPName;

		//$ionicPopup.alert({
		//	title: 'Info',
		//	template: pelanggan
		//});

		return $http({
			method: "POST",
			url: server + "?action=register",
			data: {
				'pelanggan': pelanggan,
			},
			headers: { 'Content-Type': 'application/form-data' }
		});
	};

	action.addItemToCart = function (item, idPelanggan) {
		return $http({
			method: 'POST',
			url: server + "?action=cart_add_item_by_id_pelanggan&id_pelanggan=" + idPelanggan,
			data: item,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

    action.removeItemFromCart = function (item, idPelanggan) {
        return $http({
            method: 'POST',
            url: server + "?action=cart_remove_item_by_id_pelanggan&id_pelanggan=" + idPelanggan,
            data: {
                'itemsToTransaction': item
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    };

	action.addItemToTransaction = function (transactionData, itemsToTransaction, idPelanggan) {
        //console.log(itemsToTransaction);
		return $http({
			method: 'POST',
			url: server + "?action=transaction_add_item_by_id_pelanggan&id_pelanggan=" + idPelanggan,
			data: {
                'itemsToTransaction': itemsToTransaction,
                'id_pelanggan': idPelanggan,
                'no_telp': transactionData.no_telp,
                'keterangan': transactionData.keterangan,
                'diantarkan': transactionData.diantarkan,
                'alamat_pengantaran': transactionData.alamat_pengantaran,
                'tgl_pengantaran': transactionData.tgl_pengantaran,
                'latlong': transactionData.latlong
            },
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	action.setItemArrived = function (idTransaction) {
		//console.log(itemsToTransaction);
		return $http({
			method: 'POST',
			url: server + "?action=set_transaction_checked&id_transaksi=" + idTransaction,
			data: {
				"proses_checked": "pelanggan_checked"
			},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	action.setConfirmReturn = function (idTransaction) {
		//console.log(itemsToTransaction);
		return $http({
			method: 'POST',
			url: server + "?action=set_transaction_checked&id_transaksi=" + idTransaction,
			data: {
				"proses_checked": "pelanggan_return"
			},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	action.setTransactionFinish = function (idTransaction) {
		//console.log(itemsToTransaction);
		return $http({
			method: 'POST',
			url: server + "?action=set_transaction_finish&id_transaksi=" + idTransaction,
			data: {},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	action.addRatingsToTransaction = function (idPelanggan, idTransaksi, ratings) {
		//console.log(itemsToTransaction);
		return $http({
			method: 'POST',
			url: server + "?action=add_ratings&id_pelanggan=" + idPelanggan + "&id_transaksi=" + idTransaksi,
			data: ratings,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	return action;
});
